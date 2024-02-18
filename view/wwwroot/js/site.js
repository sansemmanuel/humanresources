document.addEventListener('DOMContentLoaded', async function () {
    const apiUrl = 'http://localhost:5010'; // Ruta de la API

    try {
        const response = await axios.get(apiUrl + '/api/Despacho/Lista');
        console.log('Datos recibidos:', response.data); // Verificar los datos recibidos
        mostrarEmpleados(response.data);
    } catch (error) {
        console.error('Error al cargar los empleados:', error); // Verificar errores
        alert('Error al cargar los empleados');
    }

    function mostrarEmpleados(empleados) {
        console.log('Empleados a mostrar:', empleados); // Verificar los empleados a mostrar
        const tbody = document.querySelector('#tablaEmpleados tbody');
        tbody.innerHTML = '';

        empleados.forEach(empleado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${empleado.nombre} ${empleado.apellidoPaterno} ${empleado.apellidoMaterno}</td>
                <td>${empleado.email}</td>
                <td>${empleado.puesto}</td>
                <td>${empleado.rfc}</td>
                <td>${new Date(empleado.fechaAlta).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-primary btnEditar" data-id="${empleado.empleadoId}">Editar</button>
                    <button class="btn btn-danger btnEliminar" data-id="${empleado.empleadoId}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función para mostrar los resultados de búsqueda
    function mostrarResultadosBusqueda(resultados) {
        console.log('Resultados de la búsqueda:', resultados); // Verificar los resultados de la búsqueda
        const tbody = document.querySelector('#tablaResultados tbody');
        tbody.innerHTML = '';

        resultados.forEach(resultado => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${resultado.nombre} ${resultado.apellidoPaterno} ${resultado.apellidoMaterno}</td>
            <td>${resultado.email}</td>
            <td>${resultado.puesto}</td>
            <td>${resultado.rfc}</td>
            <td>${new Date(resultado.fechaAlta).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-primary btnEditar" data-id="${resultado.empleadoId}">Editar</button>
                <button class="btn btn-danger btnEliminar" data-id="${resultado.empleadoId}">Eliminar</button>
            </td>
        `;
            tbody.appendChild(row);
        });
    }


    // Evento clic del botón "Crear Empleado"
    document.querySelector('#btnNuevo').addEventListener('click', function () {
        // Mostrar el popup
        var formularioCrear = document.getElementById('_FormularioCrear');
        if (formularioCrear) {
            formularioCrear.style.display = 'block';
        } else {
            console.error('El elemento con ID "_FormularioCrear" no se encontró en el DOM.');
        }
    });
    // Evento clic del botón "Cancelar"
    document.querySelector('#btnCancelar').addEventListener('click', function () {
        // Ocultar el popup
        document.getElementById('_FormularioCrear').style.display = 'none';
    });

    // Evento clic del botón "Guardar Empleado"
    document.querySelector('#btnGuardarEmpleado').addEventListener('click', async function () {
        // Obtener el valor del campo de fecha de baja
        const fechaBaja = document.querySelector('#fechaBaja').value;

        // Convertir la fecha de baja a null si el campo está vacío
        const fechaBajaConvertida = fechaBaja ? fechaBaja : null;

        // Crear el objeto de nuevo empleado con los valores de los campos del formulario
        const nuevoEmpleado = {
            Nombre: document.querySelector('#nombre').value,
            ApellidoPaterno: document.querySelector('#apellidoPaterno').value,
            ApellidoMaterno: document.querySelector('#apellidoMaterno').value,
            Edad: parseInt(document.querySelector('#edad').value),
            FechaNacimiento: document.querySelector('#fechaNacimiento').value,
            Genero: document.querySelector('#genero').value,
            EstadoCivil: document.querySelector('#estadoCivil').value,
            Rfc: document.querySelector('#rfc').value,
            Direccion: document.querySelector('#direccion').value,
            Email: document.querySelector('#email').value,
            Telefono: document.querySelector('#telefono').value,
            Puesto: document.querySelector('#puesto').value,
            FechaAlta: document.querySelector('#fechaAlta').value,
            FechaBaja: fechaBajaConvertida // Utilizar la fecha de baja convertida
        };

        try {
            // Enviar los datos del nuevo empleado al servidor
            const response = await axios.post(apiUrl + '/api/Despacho/Guardar', nuevoEmpleado);
            console.log('Empleado guardado correctamente:', response.data.mensaje);
            alert('Empleado guardado correctamente');
            document.getElementById('_FormularioCrear').style.display = 'none'; // Ocultar el popup
            cargarEmpleados(); // Recargar la lista de empleados después de guardar
        } catch (error) {
            console.error('Error al guardar el empleado:', error);
            alert('Error al guardar el empleado');
        }
    });



    // Evento clic del botón "Buscar"
    document.addEventListener('DOMContentLoaded', function () {
        // Evento clic del botón "Buscar"
        document.getElementById('#btn1').addEventListener('mouseover', function () {
            mostrarFormularioBuscar();
        });

        // Evento de envío del formulario de búsqueda
        document.getElementById('formBuscarEmpleado').addEventListener('submit', function (event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado de envío del formulario
            buscarEmpleados();
        });

        // Evento clic del botón "Editar" en el grid principal
        document.querySelectorAll('.btnEditar').forEach(btn => {
            btn.addEventListener('click', function () {
                const empleadoId = this.dataset.id;
                abrirVistaParcialEditarEmpleado(empleadoId);
            });
        });

        // Función para mostrar el formulario de búsqueda
        function mostrarFormularioBuscar() {
            const formularioBuscar = document.getElementById('_FormularioBuscar');
            if (formularioBuscar) {
                formularioBuscar.style.display = 'block';
            } else {
                console.error('El elemento con ID "_FormularioBuscar" no se encontró en el DOM.');
            }
        }

        // Función para abrir la vista parcial de edición del empleado
        function abrirVistaParcialEditarEmpleado(empleadoId) {
            fetch(`http://localhost:5010/api/Despacho/Obtener/${empleadoId}`)
                .then(response => response.json())
                .then(empleado => {
                    // Llenar el formulario de edición con los datos del empleado
                    document.getElementById('editNombre').value = empleado.Nombre;
                    document.getElementById('editApellidoPaterno').value = empleado.ApellidoPaterno;
                    document.getElementById('editApellidoMaterno').value = empleado.ApellidoMaterno;
                    document.getElementById('editRFC').value = empleado.Rfc;
                    document.getElementById('editEmail').value = empleado.Email;
                    document.getElementById('editTelefono').value = empleado.Telefono;
                    document.getElementById('editPuesto').value = empleado.Puesto;
                    document.getElementById('editFechaBaja').value = empleado.FechaBaja;
                    document.getElementById('editEstadoCivil').value = empleado.EstadoCivil;
                    document.getElementById('editDireccion').value = empleado.Direccion;

                    // Mostrar la vista parcial de edición del empleado
                    document.getElementById('_formularioEditar').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error al obtener los detalles del empleado:', error);
                    alert('Error al obtener los detalles del empleado');
                });
        }

        // Función para buscar empleados
        function buscarEmpleados() {
            const nombre = document.getElementById('nombre').value;
            const rfc = document.getElementById('rfc').value;
            const fechaBaja = document.getElementById('fechaBaja').value;

            const datosBusqueda = {
                nombre: nombre,
                rfc: rfc,
                fechaBaja: fechaBaja
            };

            fetch('http://localhost:5010/api/Despacho/BuscarEmpleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosBusqueda)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Resultados de la búsqueda:', data);
                })
                .catch(error => {
                    console.error('Error al buscar empleados:', error);
                    alert('Error al buscar empleados');
                });
        }
    });









    // Función para cargar la lista de empleados
    async function cargarEmpleados() {
        try {
            const response = await axios.get(apiUrl + '/api/Despacho/Lista');
            mostrarEmpleados(response.data);
        } catch (error) {
            console.error('Error al cargar los empleados:', error);
            alert('Error al cargar los empleados');
        }
    }

    // Evento clic del botón "Actualizar"
    document.querySelector('#btnActualizar').addEventListener('click', cargarEmpleados);

    // Evento clic del botón "Editar" del empleado
    document.querySelectorAll('.btnEditar').forEach(btn => {
        btn.addEventListener('click', async function () {
            
            const empleadoId = this.dataset.id;

            try {
                // Realizar una solicitud para obtener los detalles del empleado con el ID
                const response = await axios.get(`http://localhost:5010/api/Despacho/Obtener/${empleadoId}`);
                const empleado = response.data;

                // Llenar el formulario de edición con los datos del empleado obtenidos
                document.querySelector('#editNombre').value = empleado.nombre;
                document.querySelector('#editApellidoPaterno').value = empleado.apellidoPaterno;
                document.querySelector('#editApellidoMaterno').value = empleado.apellidoMaterno;
                document.querySelector('#editEmail').value = empleado.email;
                document.querySelector('#editTelefono').value = empleado.telefono;
                document.querySelector('#editPuesto').value = empleado.puesto;
                document.querySelector('#editFechaBaja').value = empleado.fechaBaja;
                document.querySelector('#editFechaAlta').value = empleado.fechaAlta;
                document.querySelector('#editEstadoCivil').value = empleado.estadoCivil;
                document.querySelector('#editDireccion').value = empleado.direccion;
                document.querySelector('#editFechaNac').value = empleado.fechaNacimiento;
                document.querySelector('#editRFC').value = empleado.rfc;
                document.querySelector('#editGenero').value = empleado.genero;
                document.querySelector('#editEdad').value = empleado.edad; 
                document.querySelector('#editId').value = empleado.empleadoId;

                document.querySelector('#editNombre').disabled = true;
                document.querySelector('#editApellidoPaterno').disabled = true;
                document.querySelector('#editApellidoMaterno').disabled = true;
                document.querySelector('#editFechaAlta').disabled = true;
                document.querySelector('#editFechaNac').disabled = true;
                document.querySelector('#editGenero').disabled = true;
                document.querySelector('#editEdad').disabled = true;
                document.querySelector('#editId').disabled = true;

                // Mostrar la vista parcial de edición del empleado
                document.getElementById('_formularioEditar').style.display = 'block';
            } catch (error) {
                console.error('Error al obtener los detalles del empleado:', error);
                alert('Error al obtener los detalles del empleado');
            }
        });
    });


    // Evento clic del botón "Actualizar Empleado"
    document.querySelector('#btnActualizarEmpleado').addEventListener('click', async function () {
        // Obtener los valores actualizados del formulario de edición
        const idEmpleado = document.querySelector('#editId').value;
        const nombre = document.querySelector('#editNombre').value;
        const apellidoPaterno = document.querySelector('#editApellidoPaterno').value;
        const apellidoMaterno = document.querySelector('#editApellidoMaterno').value;
        const rfc = document.querySelector('#editRFC').value;
        const email = document.querySelector("#editEmail").value;
        const telefono = document.querySelector("#editTelefono").value;
        const puesto = document.querySelector("#editPuesto").value;
        const direccion = document.querySelector("#editDireccion").value;
        const fechaBajaInput = document.querySelector("#editFechaBaja");
        const fechaBaja = fechaBajaInput.value.trim() !== "" ? fechaBajaInput.value : null;

        const fechaAlta = document.querySelector("#editFechaAlta").value;
        const estadoCivil = document.querySelector("#editEstadoCivil").value;
        // Crear un objeto con los datos actualizados del empleado
        const empleadoActualizado = {
           EmpleadoId: idEmpleado,
            Nombre: nombre,
            ApellidoPaterno: apellidoPaterno,
            ApellidoMaterno: apellidoMaterno,
            Email: email,
            Puesto: puesto,
            Telefono: telefono,
            FechaBaja: fechaBaja,
            EstadoCivil: estadoCivil,
            Direccion: direccion,
            Rfc: rfc,
            FechaAlta: fechaAlta
        };

        // Enviar la solicitud al servidor para actualizar el empleado
        try {
            const response = await axios.put(apiUrl + '/api/Despacho/Editar', empleadoActualizado);
            console.log('Empleado actualizado correctamente:', response.data);
            alert('Empleado actualizado correctamente');
            ocultarFormularioEdicion(); // Ocultar el formulario de edición después de la actualización
            cargarEmpleados(); // Recargar la lista de empleados después de la actualización
        } catch (error) {
            console.error('Error al actualizar el empleado:', error);
            alert('Error al actualizar el empleado');
        }
    });


    // Evento clic del botón "Cancelar Edición"
    document.querySelector('#btnCancelarEdicion').addEventListener('click', function () {
        ocultarFormularioEdicion();
    });

    // Función para ocultar el formulario de edición
    function ocultarFormularioEdicion() {
        document.getElementById('_formularioEditar').style.display = 'none';
    }
   


       // Evento clic del botón "Eliminar"
    document.querySelector('#tablaEmpleados').addEventListener('click', async function (event) {
    if (event.target.classList.contains('btnEliminar')) {
        const empleadoId = event.target.dataset.id;
        if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            try {
                await axios.delete(apiUrl + '/api/Despacho/Eliminar/' + empleadoId);
                cargarEmpleados(); // Recargar la lista de empleados después de eliminar
            } catch (error) {
                console.error('Error al eliminar el empleado:', error);
                alert('Error al eliminar el empleado');
            }
        }
    }
});
});