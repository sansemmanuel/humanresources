using DespachoContable.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DespachoContable.Controllers
{
    [EnableCors]
    [Route("api/[controller]")]
    public class DespachoController : Controller
    {
        public readonly DESPACHOContext _dbcontext;

        public DespachoController(DESPACHOContext _context)
        {
            _dbcontext = _context;
        }

        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            List<Empleado> lista = new List<Empleado>();

            try
            {
                lista = _dbcontext.Empleados.Where(e => e.FechaBaja == null).ToList();
                Response.Headers.Add("Access-Control-Allow-Origin", "*");

                // Devolver la vista parcial con los datos de la lista de empleados
                return Ok(lista);
            }
            catch (Exception ex)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener la lista de empleados");
            }
        }

        [HttpGet]
        [Route("Obtener/{idEmpleado:int}")]
        public IActionResult Obtener(int idEmpleado)
        {
            Empleado oEmpleado = _dbcontext.Empleados.Find(idEmpleado);

            if (oEmpleado == null)
            {
                return NotFound("Empleado no encontrado");
            }

            return Ok(oEmpleado); // Devolver los detalles del empleado en formato JSON
        }

        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] Empleado empleado)
        {
            try
            {
                _dbcontext.Empleados.Add(empleado);
                _dbcontext.SaveChanges();

                return Ok(new { mensaje = "Empleado guardado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al guardar el empleado: {ex.Message}");
            }
        }


        [HttpPut]
        [Route("Editar")]
        public IActionResult Editar([FromBody] Empleado empleado)
        {
            try
            {
                var empleadoExistente = _dbcontext.Empleados.Find(empleado.EmpleadoId);
                if (empleadoExistente == null)
                {
                    return NotFound("Empleado no encontrado");
                }

                // Actualizar solo los campos editables
                empleadoExistente.Nombre = empleado.Nombre;
                empleadoExistente.ApellidoPaterno = empleado.ApellidoPaterno;
                empleadoExistente.ApellidoMaterno = empleado.ApellidoMaterno;
                empleadoExistente.Email = empleado.Email;
                empleadoExistente.Telefono = empleado.Telefono;
                empleadoExistente.Puesto = empleado.Puesto;
                empleadoExistente.FechaBaja = empleado.FechaBaja;
                empleadoExistente.EstadoCivil = empleado.EstadoCivil;
                empleadoExistente.Direccion = empleado.Direccion;
                empleadoExistente.EmpleadoId = empleado.EmpleadoId;
                empleadoExistente.Rfc = empleado.Rfc;
                _dbcontext.SaveChanges();

                return Ok("Empleado actualizado exitosamente");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al actualizar el empleado: {ex.Message}");
            }
        }
        [HttpGet("Buscar")]
        public ActionResult<IEnumerable<Empleado>> BuscarEmpleados([FromQuery] string nombre, [FromQuery] string rfc, [FromQuery] bool? fechaBaja)
        {
            IQueryable<Empleado> query = _dbcontext.Empleados;

            if (!string.IsNullOrEmpty(nombre))
            {
                query = query.Where(e => e.Nombre.Contains(nombre));
            }

            if (!string.IsNullOrEmpty(rfc))
            {
                query = query.Where(e => e.Rfc == rfc);
            }

            if (fechaBaja.HasValue)
            {
                if (fechaBaja.Value)
                {
                    query = query.Where(e => e.FechaBaja != null);
                }
                else
                {
                    query = query.Where(e => e.FechaBaja == null);
                }
            }

            var resultados = query.ToList();
            return Ok(resultados);
        }

        [HttpDelete]
        [Route("Eliminar/{idEmpleado:int}")]
        public IActionResult Eliminar(int idEmpleado)
        {
            Empleado oEmpleado = _dbcontext.Empleados.Find(idEmpleado);

            if (oEmpleado == null)
            {
                return BadRequest("Empleado no encontrado");
            }

            try
            {
                _dbcontext.Empleados.Remove(oEmpleado);
                _dbcontext.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Empleado eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error al eliminar el empleado: {ex.Message}");
            }
        }


    }
}