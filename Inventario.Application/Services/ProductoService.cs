﻿using Inventario.API.DTOs;
using Inventario.Application.DTOs;
using Inventario.Domain.Entities;
using Inventario.Domain.Interfaces;
using Inventario.Infraestructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Services
{
    public class ProductoService : IProductoService
    {
        private readonly InventarioDbContext _context;
        public ProductoService(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task CreateAsync(ProductoCreateDTO producto)
        {
            var imagenPath = "";
            var nuevoProducto = new Productos()
            {
                nombre = producto.Nombre,
                descripcion = producto.Descripcion,
                precio_unitario = producto.PrecioUnitario,
                stock = producto.Stock,
                id_categoria = producto.IdCategoria,
                fecha_creacion = DateTime.Now
            };
            if (producto.UrlImagen != null)
            {
                var imagen = await SaveFile(producto.UrlImagen);
                nuevoProducto.UrlImagen = imagen;
            }
            _context.Productos.Add(nuevoProducto);
            await _context.SaveChangesAsync();
        }

        private async Task<string> SaveFile(IFormFile form)
        {
            var fileName = Guid.NewGuid().ToString();

            string path = Path.Combine("wwwroot/images", fileName + Path.GetExtension(form.FileName));
            var directory = Path.GetDirectoryName(path);

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            using(var stream = new FileStream(path, FileMode.Create))
            {
                form.CopyTo(stream);
            }

            return path;
        }

        public async Task DeleteAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) throw new KeyNotFoundException("Producto no encontrado");

            if (!string.IsNullOrEmpty(producto.UrlImagen) && File.Exists(producto.UrlImagen))
            {
                File.Delete(producto.UrlImagen); // Eliminar la imagen
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
        }

        public async Task<(IEnumerable<ProductoUpdateDTO> Productos, int TotalItems)> GetAllAsync(int Page, int PageSize)
        {
            var totalItems = await _context.Productos.CountAsync(); // Total de productos
            var productos = await _context.Productos.Include(p => p.categorias)
                .Skip((Page - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();

            var productosDto = productos.Select(p => new ProductoUpdateDTO
            {
                IdProducto = p.id_producto,
                Nombre = p.nombre,
                Descripcion = p.descripcion,
                PrecioUnitario = p.precio_unitario,
                Stock = p.stock,
                IdCategoria = p.id_categoria,
                UrlImagenString = p.UrlImagen,
            });

            return (productosDto, totalItems);
        }


        public async Task<ProductoUpdateDTO> GetByIdAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) throw new KeyNotFoundException("Producto no encontrado");

            return new ProductoUpdateDTO
            {
                IdProducto = producto.id_producto,
                Nombre = producto.nombre,
                Descripcion = producto.descripcion,
                PrecioUnitario = producto.precio_unitario,
                Stock = producto.stock,
                IdCategoria = producto.id_categoria,
                UrlImagenString = producto.UrlImagen
            };
        }

        public async Task UpdateAsync(ProductoUpdateDTO producto)
        {
            var productoExistente = await _context.Productos.FindAsync(producto.IdProducto);
            if (productoExistente == null) throw new KeyNotFoundException("Producto no encontrado");

            productoExistente.nombre = producto.Nombre;
            productoExistente.descripcion = producto.Descripcion;
            productoExistente.precio_unitario = producto.PrecioUnitario;
            productoExistente.stock = producto.Stock;
            productoExistente.id_categoria = producto.IdCategoria;

            if  (producto.UrlImagen != null)
            {
                if (!string.IsNullOrEmpty(productoExistente.UrlImagen) && File.Exists(productoExistente.UrlImagen))
                {
                    File.Delete(productoExistente.UrlImagen); // Eliminar la imagen anterior
                }

                var nuevaImagen = await SaveFile(producto.UrlImagen);
                productoExistente.UrlImagen = nuevaImagen; // Actualizar la ruta de la imagen
            }

            _context.Productos.Update(productoExistente);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductoconCategoriaDTO>> GetByCategoriaIdAsync(int idCategoria)
        {
            var productos = await _context.Productos
                .Include(p => p.categorias)
                .Where(p => p.id_categoria == idCategoria)
                .ToListAsync();

            return productos.Select(p => new ProductoconCategoriaDTO
            {
                IdProducto = p.id_producto,
                Nombre = p.nombre,
                Descripcion = p.descripcion,
                PrecioUnitario = p.precio_unitario,
                Stock = p.stock,
                IdCategoria = p.id_categoria,
                NombreCategoria = p.categorias != null ? p.categorias.nombre : null
            });
        }
    }
}
