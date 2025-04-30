using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.DTOs
{
    public class MovimientoCreateDTO
    {
        public int IdProducto { get; set; }
        public int IdUsuario { get; set; }
        public int Cantidad { get; set; }
        public string TipoMovimiento { get; set; }
    }
}
