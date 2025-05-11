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
    }
}
