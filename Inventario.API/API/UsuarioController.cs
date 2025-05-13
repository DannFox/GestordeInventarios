using FluentValidation;
using Inventario.Application.DTOs;
using Inventario.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Inventario.API.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Solo los usuarios con el rol "Admin" pueden acceder
        public async Task<IActionResult> GetAll([FromQuery] int Page = 1, [FromQuery] int PageSize = 10)
        {
            var (usuarios, totalItems) = await _usuarioService.GetAllAsync(Page, PageSize);

            // Calcular el número total de páginas
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

            // Agregar encabezados de paginación
            Response.Headers.Add("X-Total-Count", totalItems.ToString());
            Response.Headers.Add("X-Total-Pages", totalPages.ToString());
            Response.Headers.Add("X-Current-Page", Page.ToString());
            Response.Headers.Add("X-Page-Size", PageSize.ToString());

            return Ok(usuarios);
        }

        [HttpPost]
        [AllowAnonymous] // Permitir que usuarios no autenticados puedan registrarse
        public async Task<IActionResult> Create([FromBody] UsuarioCreateDTO usuario)
        {
            try
            {
                await _usuarioService.CreateAsync(usuario);
                return Ok("Usuario creado exitosamente");
            }
            catch (FluentValidation.ValidationException ex)
            {
                return BadRequest(new { Errors = ex.Errors.Select(e => e.ErrorMessage).ToList() });
            }
        }

        [HttpPut("{id}/CambiarEmail")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestablecerCorreo(int id, [FromBody] UsuarioUpdateCorreoDTO dto)
        {
            try
            {
                await _usuarioService.RestablecerCorreoAsync(id, dto);
                return Ok("Correo actualizado exitosamente");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }

        [HttpPut("{id}/CambiarPassword")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestablecerContrasena(int id, [FromBody] UsuarioUpdateContrasenaDTO dto)
        {
            try
            {
                await _usuarioService.RestablecerContrasenaAsync(id, dto);
                return Ok("Contraseña actualizada correctamente.");
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
                await _usuarioService.DeleteAsync(id);
                return Ok("Usuario eliminado exitosamente.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }
    }
}
