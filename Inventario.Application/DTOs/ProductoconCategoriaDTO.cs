using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.DTOs
{
    public class ProductoconCategoriaDTO
    {
        public int IdProducto {  get; set; }
        public string Nombre { get; set; }
        public string Descripcion {  get; set; }
        public float PrecioUnitario { get; set; }
        public int Stock {  get; set; }
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; }
    }
}
