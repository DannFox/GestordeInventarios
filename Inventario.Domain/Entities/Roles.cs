using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Entities
{
    public class Roles
    {
        public int id_rol { get; set; }
        public string nombre { get; set; } = string.Empty;

        public ICollection<Usuarios> Usuarios { get; set; }
    }
}
