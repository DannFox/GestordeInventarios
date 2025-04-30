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
        private readonly string _imagePath;

        public ImagenService(InventarioDbContext context, IWebHostEnvironment environment) 
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _imagePath = Path.Combine(environment.WebRootPath, "uploads/images");
            if (!Directory.Exists(_imagePath))
            {
                Directory.CreateDirectory(_imagePath);
            }
        }

        public async Task DeleteAsync(int id)
        {
            var imagen = await _context.Imagenes_Productos.FindAsync(id);
            if (imagen == null)
            {
                throw new Exception("Imagen no encontrada");
            }

            var filePath = Path.Combine(_imagePath, imagen.url);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
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
                Url = $"/uploads/images/{i.url}"
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
                Url = $"/uploads/images/{imagen.url}"
            };
        }

        public async Task<string> UploadAsync(IFormFile file, int idProducto)
        {
            if (file.Length <= 0)
            {
                throw new Exception("El archivo está vacío");
            }

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (extension != ".jpg" && extension != ".png" && extension != ".jpeg")
            {
                throw new Exception("Formato de imagen no válido");
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_imagePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            var nuevaImagen = new Imagenes_Productos
            {
                id_producto = idProducto,
                url = fileName
            };

            _context.Imagenes_Productos.Add(nuevaImagen);
            await _context.SaveChangesAsync();

            return fileName;
        }
    }
}
