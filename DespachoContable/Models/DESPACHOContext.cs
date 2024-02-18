using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DespachoContable.Models
{
    public partial class DESPACHOContext : DbContext
    {
        public DESPACHOContext()
        {
        }

        public DESPACHOContext(DbContextOptions<DESPACHOContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Empleado> Empleados { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Empleado>(entity =>
            {
                entity.Property(e => e.EmpleadoId).HasColumnName("EmpleadoID");

                entity.Property(e => e.ApellidoMaterno).HasMaxLength(50);

                entity.Property(e => e.ApellidoPaterno).HasMaxLength(50);

                entity.Property(e => e.Direccion).HasMaxLength(100);

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.EstadoCivil).HasMaxLength(20);

                entity.Property(e => e.FechaAlta).HasColumnType("date");

                entity.Property(e => e.FechaBaja).HasColumnType("date");

                entity.Property(e => e.FechaNacimiento).HasColumnType("date");

                entity.Property(e => e.Genero).HasMaxLength(10);

                entity.Property(e => e.Nombre).HasMaxLength(50);

                entity.Property(e => e.Puesto).HasMaxLength(50);

                entity.Property(e => e.Rfc)
                      .HasMaxLength(13)
                      .HasColumnName("RFC");

                entity.Property(e => e.Telefono).HasMaxLength(20);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}