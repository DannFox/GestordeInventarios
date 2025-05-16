using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.DTOs
{
    public class ImagenCreateDTO
    {
        public int IdProducto { get; set; }
        public IFormFile Imagen {  get; set; }
    }
}
