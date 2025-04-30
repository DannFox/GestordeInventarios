using FluentValidation;
using Inventario.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Validators
{
    public class UsuarioCreateValidator : AbstractValidator<UsuarioCreateDTO>
    {
        public UsuarioCreateValidator() 
        {
            RuleFor(u => u.Nombre)
               .NotEmpty().WithMessage("El nombre es obligatorio.")
               .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");

            RuleFor(u => u.Correo)
                .NotEmpty().WithMessage("El correo es obligatorio.")
                .EmailAddress().WithMessage("El correo no tiene un formato válido.");

            RuleFor(u => u.Contrasena)
                .NotEmpty().WithMessage("La contraseña es obligatoria.")
                .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres.");

            RuleFor(u => u.IdRol)
                .GreaterThan(0).WithMessage("Debe especificar un rol válido.");
        }
    }
}
