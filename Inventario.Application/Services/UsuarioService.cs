using Inventario.Application.DTOs;
using Inventario.Application.Interfaces;
using Inventario.Application.Utils;
using Inventario.Application.Validators;
using Inventario.Domain.Entities;
using Inventario.Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Inventario.Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly InventarioDbContext _context;

        public UsuarioService(InventarioDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<UsuarioResponseDTO> Usuarios, int TotalItems)> GetAllAsync(int Page, int PageSize)
        {
            var totalItems = await _context.Usuarios.CountAsync(); // Total de usuarios
            var usuarios = await _context.Usuarios
                .Include(u => u.roles)
                .Skip((Page - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();

            var usuariosDto = usuarios.Select(u => new UsuarioResponseDTO
            {
                IdUsuario = u.id_usuario,
                Nombre = u.nombre,
                Correo = u.correo,
                Rol = u.roles.nombre
            });

            return (usuariosDto, totalItems);
        }

        public async Task<UsuarioResponseDTO> GetByIdAsync(int id)
        {
            var usuario = await _context.Usuarios.Include(u => u.roles).FirstOrDefaultAsync(u => u.id_usuario == id);

            if (usuario == null) throw new KeyNotFoundException("Usuario no encontrado.");

            return new UsuarioResponseDTO
            {
                IdUsuario = usuario.id_usuario,
                Nombre = usuario.nombre,
                Correo = usuario.correo,
                Rol = usuario.roles.nombre
            };
        }

        public async Task CreateAsync(UsuarioCreateDTO usuario)
        {
            var validator = new UsuarioCreateValidator();
            ValidationResult result = validator.Validate(usuario);
            if (!result.IsValid) 
                throw new ValidationException(result.Errors);

            var salt = PasswordHasher.GenerateSalt();
            var hashedPassword = PasswordHasher.HashPassword(usuario.Contrasena, salt);
            var nuevoUsuario = new Usuarios
            {
                nombre = usuario.Nombre,
                correo = usuario.Correo,
                contrasena = hashedPassword,
                salt = salt,
                id_rol = usuario.IdRol
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> VerifyLogin(string correo, string contrasena)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.correo == correo);
            if (usuario == null) return false;

            // Generar el hash de la contraseña proporcionada usando el salt almacenado
            var hashedPassword = PasswordHasher.HashPassword(contrasena, usuario.salt);

            // Comparar el hash con el almacenado
            return usuario.contrasena == hashedPassword;
        }

        public async Task RestablecerCorreoAsync(int idUsuario, UsuarioUpdateCorreoDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(idUsuario);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            if (!string.IsNullOrWhiteSpace(dto.Correo) && usuario.correo != dto.Correo)
                usuario.correo = dto.Correo;

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task RestablecerContrasenaAsync(int idUsuario, UsuarioUpdateContrasenaDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(idUsuario);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");
            
            if (!string.IsNullOrWhiteSpace(dto.NuevaContrasena))
            {
                var salt = PasswordHasher.GenerateSalt();
                usuario.salt = salt;
                usuario.contrasena = PasswordHasher.HashPassword(dto.NuevaContrasena, salt);
            }

            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int idUsuario)
        {
            var usuario = await _context.Usuarios.FindAsync(idUsuario);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<UsuarioResponseDTO>> GetByRolAsync(int idRol)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.roles)
                .Where(u => u.id_rol == idRol)
                .ToListAsync();

            return usuario.Select(u => new UsuarioResponseDTO
            {
                IdUsuario = u.id_usuario,
                Nombre = u.nombre,
                Correo = u.correo,
                Rol = u.roles.nombre,
            });
        }
        public async Task CambiarRolAsync(int idUsuario, UsuarioUpdateRolDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(idUsuario);
            if (usuario == null)
                throw new KeyNotFoundException("Usuario no encontrado");

            usuario.id_rol = dto.IdRol;
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
        }
    }
}
