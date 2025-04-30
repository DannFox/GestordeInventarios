using Inventario.Application.DTOs;
using Inventario.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Inventario.API.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MovimientosController : ControllerBase
    {
        private readonly IMovimientoService _movimientoService;

        public MovimientosController(IMovimientoService movimientoService)
        {
            _movimientoService = movimientoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movimientos = await _movimientoService.GetAllAsync();
            return Ok(movimientos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var movimiento = await _movimientoService.GetByIdAsync(id);
            return Ok(movimiento);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MovimientoCreateDTO movimiento)
        {
            await _movimientoService.CreateAsync(movimiento);
            return Ok();
        }
    }
}
