using Inventario.API.DTOs;
using Inventario.Domain.Entities;
using Inventario.Domain.Interfaces;
using Inventario.Infraestructure.Data;
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
            var nuevoProducto = new Productos
            {
                nombre = producto.Nombre,
                descripcion = producto.Descripcion,
                precio_unitario = producto.PrecioUnitario,
                stock = producto.Stock,
                id_categoria = producto.IdCategoria,
                fecha_creacion = DateTime.Now
            };

            _context.Productos.Add(nuevoProducto);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) throw new KeyNotFoundException("Producto no encontrado");

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductoUpdateDTO>> GetAllAsync()
        {
            var productos = await _context.Productos.Include(p => p.categorias).ToListAsync();
            return productos.Select(p => new ProductoUpdateDTO
            {
                IdProducto = p.id_producto,
                Nombre = p.nombre,
                Descripcion = p.descripcion,
                PrecioUnitario = p.precio_unitario,
                Stock = p.stock,
                IdCategoria = p.id_categoria
            });
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
                IdCategoria = producto.id_categoria
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

            _context.Productos.Update(productoExistente);
            await _context.SaveChangesAsync();
        }
    }
}
