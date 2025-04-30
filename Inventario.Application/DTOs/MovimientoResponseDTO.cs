using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.DTOs
{
    public class MovimientoResponseDTO
    {
        public int IdMovimiento { get; set; }
        public int IdProducto { get; set; }
        public string NombreProducto { get; set; }
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; }
        public int Cantidad { get; set; }
        public DateTime FechaMovimiento { get; set; }
        public string TipoMovimiento { get; set; } 
    }
}
