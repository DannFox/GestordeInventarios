using Inventario.Application.DTOs;
using Inventario.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Inventario.API.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class RolController : ControllerBase
    {
        private readonly IRolService _rolService;
        public RolController(IRolService rolService)
        {
            _rolService = rolService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var roles = await _rolService.GetAllAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var rol = await _rolService.GetByIdAsync(id);
            if (rol == null) return NotFound("Rol no encontrado.");
            return Ok(rol);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RolCreateDTO rol)
        {
            await _rolService.CreateAsync(rol);
            return Ok("Rol creado exitosamente.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RolUpdateDTO rol)
        {
            await _rolService.UpdateAsync(id, rol);
            return Ok("Rol actualizado exitosamente.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _rolService.DeleteAsync(id);
            return Ok("Rol eliminado exitosamente.");
        }
    }
}
