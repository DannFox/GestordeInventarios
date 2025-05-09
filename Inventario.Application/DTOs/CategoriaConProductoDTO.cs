using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.DTOs
{
    public class CategoriaConProductoDTO
    {
        public int IdCategoria { get; set; }
        public string Nombre { get; set; }
        public List<ProductoDTO> Productos { get; set; }
    }
}
