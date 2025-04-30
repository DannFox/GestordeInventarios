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
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            return Ok(usuario);
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
    }
}
