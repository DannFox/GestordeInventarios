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

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagen.url.TrimStart('/'));
            if (File.Exists(filePath))
                File.Delete(filePath);

            _context.Imagenes_Productos.Remove(imagen);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ImagenResponseDTO>> GetAllAsync(int Page, int PageSize)
        {
            var imagenes = await _context.Imagenes_Productos
                .Skip((Page - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();
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

        public async Task<string> UploadAsync(ImagenCreateDTO imagenDto)
        {
            if (imagenDto.Imagen == null || imagenDto.Imagen.Length == 0)
                throw new ArgumentException("El archivo de imagen no es válido");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagenes");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{imagenDto.Imagen.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imagenDto.Imagen.CopyToAsync(stream);
            }

            var nuevaImagen = new Imagenes_Productos
            {
                id_imagen = imagenDto.IdProducto,
                url = $"/imagenes/{uniqueFileName}"
            };

            _context.Imagenes_Productos.Add(nuevaImagen);
            await _context.SaveChangesAsync();

            return nuevaImagen.url;
        }
    }
}
