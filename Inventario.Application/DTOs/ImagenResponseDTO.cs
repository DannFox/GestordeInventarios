using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.DTOs
{
    public class ImagenResponseDTO
    {
        public string IdImagen { get; set; }
        public string IdProducto { get; set; }
        public string Url { get; set; }
    }
}
