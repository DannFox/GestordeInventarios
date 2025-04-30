using Inventario.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Interfaces
{
    public interface IMovimientoService
    {
        Task<IEnumerable<MovimientoResponseDTO>> GetAllAsync();
        Task<MovimientoResponseDTO> GetByIdAsync(int id);
        Task CreateAsync(MovimientoCreateDTO movimiento);
    }
}
