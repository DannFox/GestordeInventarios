using Inventario.API.DTOs;
using Inventario.Application.Utils;
using Inventario.Domain.Entities;
using Inventario.Infraestructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Inventario.API.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly InventarioDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(InventarioDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Usuarios
                 .Include(u => u.roles)
                 .FirstOrDefault(u => u.correo == request.Correo);

            if (user == null)
            {
                return Unauthorized(new {error = "Credenciales invalidas"});
            }

            var hashedPassword = PasswordHasher.HashPassword(request.Contrasena, user.salt);

            if (user.contrasena != hashedPassword)
                return Unauthorized(new { error = "Credenciales invalidas" });

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(Usuarios usuarios)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuarios.nombre),
                new Claim(JwtRegisteredClaimNames.Email, usuarios.correo),
                new Claim("id_usuario", usuarios.id_usuario.ToString()),
                new Claim(ClaimTypes.Role, usuarios.roles.nombre)
            };

            var token = new JwtSecurityToken(
               issuer: _configuration["Jwt:Issuer"],
               audience: _configuration["Jwt:Issuer"],
               claims: claims,
               expires: DateTime.Now.AddHours(1),
               signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
