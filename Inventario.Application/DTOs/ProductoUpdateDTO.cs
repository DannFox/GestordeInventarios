using Microsoft.AspNetCore.Http;

namespace Inventario.API.DTOs
{
    public class ProductoUpdateDTO
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public float PrecioUnitario { get; set; }
        public int Stock { get; set; }
        public int IdCategoria { get; set; }
        public IFormFile UrlImagen { get; set; }
    }
}
