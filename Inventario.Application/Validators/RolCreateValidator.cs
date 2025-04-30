using FluentValidation;
using Inventario.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Validators
{
    public class RolCreateValidator : AbstractValidator<RolCreateDTO>
    {
        public RolCreateValidator() 
        {
            RuleFor(x => x.Nombre)
                .NotEmpty()
                .WithMessage("El nombre del rol es obligatorio.")
                .Length(3, 50)
                .WithMessage("El nombre del rol debe tener entre 3 y 50 caracteres.");
        }
    }
}
