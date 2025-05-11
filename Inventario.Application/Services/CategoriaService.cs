using Inventario.Application.DTOs;
using Inventario.Domain.Entities;
using Inventario.Infraestructure.Data;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Inventario.Application.Services
{
    public class CategoriaService
    {
        private readonly InventarioDbContext _context;
        public CategoriaService (InventarioDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Categorias> Categorias, int TotalItems)> GetAllAsync(int Page, int PageSize)
        {
            var totalItems = await _context.Categorias.CountAsync(); // Total de categorías
            var categorias = await _context.Categorias
                .Skip((Page - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();

            return (categorias, totalItems);
        }

        public async Task<Categorias> GetByIdAsync(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) throw new KeyNotFoundException("Categoría no encontrada.");
            return categoria;
        }

        public async Task<CategoriaConProductoDTO> GetBydIdProductosAsync(int id)
        {
            var categoria = await _context.Categorias
                .Include(c => c.Productos) 
                .FirstOrDefaultAsync(c => c.id_categoria == id);

            if (categoria == null) throw new KeyNotFoundException("Categoría no encontrada.");

            return new CategoriaConProductoDTO
            {
                IdCategoria = categoria.id_categoria,
                Nombre = categoria.nombre,
                Productos = categoria.Productos.Select(p => new ProductoDTO
                {
                    IdProducto = p.id_producto,
                    Nombre = p.nombre,
                    Descripcion = p.descripcion,
                    PrecioUnitario = p.precio_unitario,
                    Stock = p.stock
                }).ToList()
            };
        }

        public async Task CreateAsync(string nombre)
        {
            var nuevaCategoria = new Categorias
            {
                nombre = nombre
            };

            _context.Categorias.Add(nuevaCategoria);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, string nombre)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) throw new KeyNotFoundException("Categoria no encontrada");

            categoria.nombre = nombre;
            _context.Categorias.Update(categoria);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) throw new KeyNotFoundException("Categoria no encontrada");

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
        }
    }
}
