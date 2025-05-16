using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Domain.Entities
{
    public class Productos
    {
        public int id_producto { get; set; }
        public string nombre { get; set; } = string.Empty;
        public string descripcion { get; set; } = string.Empty;
        public float precio_unitario { get; set; }
        public int stock { get; set; }
        public DateTime fecha_creacion { get; set; } = DateTime.Now;
        public int id_categoria { get; set; }
        public string? UrlImagen { get; set; }

        public Categorias categorias { get; set; }
    }
}
