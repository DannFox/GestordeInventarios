using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Entities
{
    public class Movimientos
    {
        public int id_movimiento { get; set; }
        public int id_producto { get; set; }
        public int id_usuario { get; set; }
        public int cantidad { get; set; }
        public DateTime fecha_movimiento { get; set; } = DateTime.Now;
        public string tipo_movimiento { get; set; }
        public Productos productos { get; set; }
        public Usuarios usuarios { get; set; }
    }
}
