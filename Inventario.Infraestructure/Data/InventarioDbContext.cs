using Inventario.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Infraestructure.Data
{
    public class InventarioDbContext : DbContext
    {
        public InventarioDbContext(DbContextOptions<InventarioDbContext> options) : base(options)
        {
        }
        public DbSet<Productos> Productos { get; set; }
        public DbSet<Categorias> Categorias { get; set; }
        public DbSet<Movimientos> Movimientos { get; set; }
        public DbSet<Imagenes_Productos> Imagenes_Productos { get; set; }
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Roles> Roles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de las entidades y relaciones
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Productos>(entity =>
            {
                entity.HasKey(e => e.id_producto);
                entity.HasOne(p => p.categorias)
                    .WithMany(c => c.Productos)
                    .HasForeignKey(p => p.id_categoria)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(u => u.nombre)
                      .IsRequired();
                entity.Property(p => p.descripcion)
                      .IsRequired(); // No acepta NULL

                entity.Property(p => p.precio_unitario)
                      .IsRequired(); // No acepta NULL

            });

            modelBuilder.Entity<Categorias>(entity =>
            {
                entity.HasKey(e => e.id_categoria);
            });

            modelBuilder.Entity<Movimientos>(entity =>
            {
                entity.HasKey(e => e.id_movimiento);
                entity.HasOne(m => m.productos)
                    .WithMany()
                    .HasForeignKey(m => m.id_producto)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(m => m.usuarios)
                    .WithMany()
                    .HasForeignKey(m => m.id_usuario)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(g => g.tipo_movimiento)
                      .IsRequired();
            });

            modelBuilder.Entity<Usuarios>(entity =>
            {
                entity.HasKey(e => e.id_usuario);
                entity.HasOne(u => u.roles)
                    .WithMany()
                    .HasForeignKey(u => u.id_rol)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(u => u.nombre)
                      .IsRequired(); // No acepta NULL

                entity.Property(u => u.correo)
                      .IsRequired(); // No acepta NULL

                entity.Property(u => u.contrasena)
                      .IsRequired(); // No acepta NULL

                entity.Property(u => u.salt)
                      .IsRequired(); // No acepta NULL
            });

            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.id_rol);
            });

            modelBuilder.Entity<Imagenes_Productos>(entity =>
            {
                entity.HasKey(e => e.id_imagen);
                entity.HasOne(i => i.productos)
                    .WithMany()
                    .HasForeignKey(i => i.id_producto)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
