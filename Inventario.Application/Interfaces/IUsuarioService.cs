using Inventario.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<(IEnumerable<UsuarioResponseDTO> Usuarios, int TotalItems)> GetAllAsync(int Page, int PageSize);

        Task<UsuarioResponseDTO> GetByIdAsync(int id);
        Task CreateAsync(UsuarioCreateDTO usuario);
    }
}
