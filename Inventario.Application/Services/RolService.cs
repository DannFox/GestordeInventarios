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
    public class RolService : IRolService
    {
        private readonly InventarioDbContext _context;
        public RolService(InventarioDbContext context)
        {
            _context = context;
        }
        public async Task CreateAsync(RolCreateDTO rol)
        {
            var nuevoRol = new Roles
            {
                nombre = rol.Nombre
            };

            _context.Roles.Add(nuevoRol);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteAsync(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null)
            {
                throw new Exception("Rol no encontrado");
            }
            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RolResponseDTO>> GetAllAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            return roles.Select(r => new RolResponseDTO
            {
                IdRol = r.id_rol,
                Nombre = r.nombre
            }).ToList();
        }

        public async Task<RolResponseDTO> GetByIdAsync(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null)
            {
                throw new Exception("Rol no encontrado");
            }

            return new RolResponseDTO
            {
                IdRol = rol.id_rol,
                Nombre = rol.nombre
            };
        }

        public async Task UpdateAsync(int id, RolUpdateDTO rol)
        {
            var rolExistente = await _context.Roles.FindAsync(id);
            if (rolExistente == null)
            {
                throw new Exception("Rol no encontrado");
            }

            rolExistente.nombre = rol.Nombre;
            await _context.SaveChangesAsync();
        }
    }
}
