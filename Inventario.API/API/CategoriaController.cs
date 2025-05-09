using Inventario.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Inventario.API.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriaController : ControllerBase
    {
        private readonly CategoriaService _categoriaService;

        public CategoriaController(CategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categorias = await _categoriaService.GetAllAsync();
            return Ok(categorias);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var categoria = await _categoriaService.GetByIdAsync(id);
                return Ok(categoria);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new {Error = ex.Message});
            }
        }

        [HttpGet("{id}/productos")]
        public async Task<IActionResult> GetByIdWithProducts(int id)
        {
            var categoria = await _categoriaService.GetBydIdProductosAsync(id);
            return Ok(categoria);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                return BadRequest(new { Error = "El nombre de la categoria es obligatorio" });

            await _categoriaService.CreateAsync(nombre);
            return Ok(new { Message = "Categoria creada exitosamente" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,  [FromBody] string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                return BadRequest(new { Error = "El nombre de la categoria es obligatorio" });
            try
            {
                await _categoriaService.UpdateAsync(id, nombre);
                return Ok(new { Message = "Categoria actualizada exitosamente" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _categoriaService.DeleteAsync(id);
                return Ok(new { Message = "Categoría eliminada exitosamente." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }
    }
}