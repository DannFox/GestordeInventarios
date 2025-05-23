﻿// <auto-generated />
using System;
using Inventario.Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Inventario.Infraestructure.Migrations
{
    [DbContext(typeof(InventarioDbContext))]
    [Migration("20250425205022_AddSaltToUsers")]
    partial class AddSaltToUsers
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Inventario.Domain.Entities.Categorias", b =>
                {
                    b.Property<int>("id_categoria")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_categoria"));

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id_categoria");

                    b.ToTable("Categorias");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Imagenes_Productos", b =>
                {
                    b.Property<int>("id_imagen")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_imagen"));

                    b.Property<int>("id_producto")
                        .HasColumnType("int");

                    b.Property<string>("url")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id_imagen");

                    b.HasIndex("id_producto");

                    b.ToTable("Imagenes_Productos");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Movimientos", b =>
                {
                    b.Property<int>("id_movimiento")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_movimiento"));

                    b.Property<int>("cantidad")
                        .HasColumnType("int");

                    b.Property<DateTime>("fecha_movimiento")
                        .HasColumnType("datetime2");

                    b.Property<int>("id_producto")
                        .HasColumnType("int");

                    b.Property<int>("id_usuario")
                        .HasColumnType("int");

                    b.Property<string>("tipo_movimiento")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id_movimiento");

                    b.HasIndex("id_producto");

                    b.HasIndex("id_usuario");

                    b.ToTable("Movimientos");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Productos", b =>
                {
                    b.Property<int>("id_producto")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_producto"));

                    b.Property<string>("descripcion")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("fecha_creacion")
                        .HasColumnType("datetime2");

                    b.Property<int>("id_categoria")
                        .HasColumnType("int");

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("precio_unitario")
                        .HasColumnType("real");

                    b.Property<int>("stock")
                        .HasColumnType("int");

                    b.HasKey("id_producto");

                    b.HasIndex("id_categoria");

                    b.ToTable("Productos");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Roles", b =>
                {
                    b.Property<int>("id_rol")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_rol"));

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id_rol");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Usuarios", b =>
                {
                    b.Property<int>("id_usuario")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id_usuario"));

                    b.Property<int?>("Rolesid_rol")
                        .HasColumnType("int");

                    b.Property<string>("contrasena")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("correo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("id_rol")
                        .HasColumnType("int");

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("salt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id_usuario");

                    b.HasIndex("Rolesid_rol");

                    b.HasIndex("id_rol");

                    b.ToTable("Usuarios");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Imagenes_Productos", b =>
                {
                    b.HasOne("Inventario.Domain.Entities.Productos", "productos")
                        .WithMany()
                        .HasForeignKey("id_producto")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("productos");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Movimientos", b =>
                {
                    b.HasOne("Inventario.Domain.Entities.Productos", "productos")
                        .WithMany()
                        .HasForeignKey("id_producto")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Inventario.Domain.Entities.Usuarios", "usuarios")
                        .WithMany()
                        .HasForeignKey("id_usuario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("productos");

                    b.Navigation("usuarios");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Productos", b =>
                {
                    b.HasOne("Inventario.Domain.Entities.Categorias", "categorias")
                        .WithMany("Productos")
                        .HasForeignKey("id_categoria")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("categorias");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Usuarios", b =>
                {
                    b.HasOne("Inventario.Domain.Entities.Roles", null)
                        .WithMany("Usuarios")
                        .HasForeignKey("Rolesid_rol");

                    b.HasOne("Inventario.Domain.Entities.Roles", "roles")
                        .WithMany()
                        .HasForeignKey("id_rol")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("roles");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Categorias", b =>
                {
                    b.Navigation("Productos");
                });

            modelBuilder.Entity("Inventario.Domain.Entities.Roles", b =>
                {
                    b.Navigation("Usuarios");
                });
#pragma warning restore 612, 618
        }
    }
}
