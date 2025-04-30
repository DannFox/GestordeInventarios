using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Entities
{
    public class Usuarios
    {
        public int id_usuario { get; set; }
        public string nombre { get; set; } = string.Empty;
        public string correo { get; set; } = string.Empty;
        public string contrasena { get; set; } = string.Empty ;
        public string salt { get; set; } = string.Empty;
        public int id_rol { get; set; }

        public Roles roles { get; set; }
    }
}
