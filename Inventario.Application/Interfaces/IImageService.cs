using Inventario.Application.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Interfaces
{
    public interface IImageService
    {
        Task<IEnumerable<ImagenResponseDTO>> GetAllAsync(int Page, int PageSize);
        Task<ImagenResponseDTO> GetByIdAsync(int id);
        Task<string> UploadAsync(ImagenCreateDTO imagenDto);
        Task DeleteAsync(int id);
    }
}
