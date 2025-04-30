using Inventario.Application.DTOs;
using Inventario.Application.Interfaces;
using Inventario.Domain.Entities;
using Inventario.Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Services
{
    public class MovimientoService : IMovimientoService
    { private readonly InventarioDbContext _context;
        public MovimientoService(InventarioDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(MovimientoCreateDTO movimiento)
        {
            var nuevoMovimiento = new Movimientos
            {
                id_producto = movimiento.IdProducto,
                id_usuario = movimiento.IdUsuario,
                cantidad = movimiento.Cantidad,
                tipo_movimiento = movimiento.TipoMovimiento,
                fecha_movimiento = DateTime.Now,
            };

            _context.Movimientos.Add(nuevoMovimiento);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MovimientoResponseDTO>> GetAllAsync()
        {
            var movimientos = await _context.Movimientos
                .Include(m => m.productos)
                .Include(m => m.usuarios)
                .ToListAsync();

            return movimientos.Select(m => new MovimientoResponseDTO
            {
                IdMovimiento = m.id_movimiento,
                IdProducto = m.id_producto,
                NombreProducto = m.productos.nombre,
                IdUsuario = m.id_usuario,
                NombreUsuario = m.usuarios.nombre,
                Cantidad = m.cantidad,
                FechaMovimiento = m.fecha_movimiento,
                TipoMovimiento = m.tipo_movimiento
            });

        }

        public async Task<MovimientoResponseDTO> GetByIdAsync(int id)
        {
            var movimiento = await _context.Movimientos
                 .Include(m => m.productos)
                 .Include(m => m.usuarios)
                 .FirstOrDefaultAsync(m => m.id_movimiento == id);

            if (movimiento == null) throw new KeyNotFoundException("Movimiento no encontrado.");

            return new MovimientoResponseDTO
            {
                IdMovimiento = movimiento.id_movimiento,
                IdProducto = movimiento.id_producto,
                NombreProducto = movimiento.productos.nombre,
                IdUsuario = movimiento.id_usuario,
                NombreUsuario = movimiento.usuarios.nombre,
                Cantidad = movimiento.cantidad,
                FechaMovimiento = movimiento.fecha_movimiento,
                TipoMovimiento = movimiento.tipo_movimiento
            };
        }
    }
}
