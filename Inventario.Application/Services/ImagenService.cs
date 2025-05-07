using Inventario.Application.DTOs;
using Inventario.Application.Interfaces;
using Inventario.Domain.Entities;
using Inventario.Infraestructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Services
{
    public class ImagenService : IImageService
    {
        private readonly InventarioDbContext _context;
        public ImagenService(InventarioDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task DeleteAsync(int id)
        {
            var imagen = await _context.Imagenes_Productos.FindAsync(id);
            if (imagen == null)
            {
                throw new Exception("Imagen no encontrada");
            }

            _context.Imagenes_Productos.Remove(imagen);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ImagenResponseDTO>> GetAllAsync()
        {
            var imagenes = await _context.Imagenes_Productos.ToListAsync();
            return imagenes.Select(i => new ImagenResponseDTO
            {
                IdImagen = i.id_imagen.ToString(),
                IdProducto = i.id_producto.ToString(),
                Url = i.url // URL proporcionada por el frontend
            });
        }

        public async Task<ImagenResponseDTO> GetByIdAsync(int id)
        {
            var imagen = await _context.Imagenes_Productos.FindAsync(id);
            if (imagen == null)
            {
                throw new Exception("Imagen no encontrada");
            }

            return new ImagenResponseDTO
            {
                IdImagen = imagen.id_imagen.ToString(),
                IdProducto = imagen.id_producto.ToString(),
                Url = imagen.url
            };
        }

        public async Task<string> UploadAsync(string url, int idProducto)
        {
            var nuevaImagen = new Imagenes_Productos
            {
                id_producto = idProducto,
                url = url // Guardar la URL proporcionada por el frontend
            };

            _context.Imagenes_Productos.Add(nuevaImagen);
            await _context.SaveChangesAsync();

            return nuevaImagen.url;
        }
    }
}
