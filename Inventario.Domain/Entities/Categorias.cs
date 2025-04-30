using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Entities
{
    public class Categorias
    {
        public int id_categoria { get; set; }
        public string nombre { get; set; }

        public ICollection<Productos> Productos { get; set; }
    }
}
