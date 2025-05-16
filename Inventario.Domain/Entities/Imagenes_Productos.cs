using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Entities
{
    public class Imagenes_Productos
    {
        public int id_imagen { get; set; }
        public int id_producto { get; set; }
        public string url { get; set; } = string.Empty;
        public Productos productos { get; set; }
    }
}
