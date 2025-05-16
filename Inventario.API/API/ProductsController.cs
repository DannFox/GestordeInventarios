using Inventario.API.DTOs;
using Inventario.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Inventario.API.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductoService _productService;

        public ProductsController(IProductoService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int Page = 1, [FromQuery] int PageSize = 10)
        {
            var (productos, totalItems) = await _productService.GetAllAsync(Page, PageSize);

            // Calcular el número total de páginas
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            // Agregar headers de paginación
            Response.Headers.Add("X-Total-Count", totalItems.ToString());
            Response.Headers.Add("X-Total-Pages", totalPages.ToString());
            Response.Headers.Add("X-Current-Page", Page.ToString());
            Response.Headers.Add("X-Page-Size", PageSize.ToString());

            return Ok(productos);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductoCreateDTO producto)
        {
            await _productService.CreateAsync(producto);
            return CreatedAtAction(nameof(GetById), new { id = producto.IdCategoria }, producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductoUpdateDTO producto)
        {
            if (id != producto.IdProducto)
            {
                return BadRequest("El id del producto no coincide");
            }
            await _productService.UpdateAsync(producto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("PorCategoria/{idCategoria}")]
        public async Task<IActionResult> GetByCategoriaId(int idCategoria)
        {
            var productos = await _productService.GetByCategoriaIdAsync(idCategoria);
            return Ok(productos);
        }
    }
}
