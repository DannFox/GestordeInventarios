using Inventario.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Interfaces
{
    public interface IRolService
    {
        Task<IEnumerable<RolResponseDTO>> GetAllAsync();
        Task<RolResponseDTO> GetByIdAsync(int id);
        Task<RolResponseDTO> CreateAsync(RolCreateDTO rol);
        Task UpdateAsync(int id, RolUpdateDTO rol);
        Task DeleteAsync(int id);
    }
}
