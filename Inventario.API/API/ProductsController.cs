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
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductoCreateDTO producto)
        {
            await _productService.CreateAsync(producto);
            return CreatedAtAction(nameof(GetById), new { id = producto.IdCategoria }, producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductoUpdateDTO producto)
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
    }
}
