using Inventario.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Interfaces
{
    public interface IProductoService
    {
        Task<IEnumerable<ProductoUpdateDTO>> GetAllAsync();
        Task<ProductoUpdateDTO> GetByIdAsync(int id);
        Task CreateAsync(ProductoCreateDTO producto);
        Task UpdateAsync(ProductoUpdateDTO producto);
        Task DeleteAsync(int id);
    }
}
