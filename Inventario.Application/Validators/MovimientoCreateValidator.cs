using FluentValidation;
using Inventario.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inventario.Application.Validators
{
    public class MovimientoCreateValidator : AbstractValidator<MovimientoCreateDTO>
    {
        public MovimientoCreateValidator() 
        {
            RuleFor(m => m.IdProducto)
                .GreaterThan(0).WithMessage("El ID del producto debe ser mayor a 0");

            RuleFor(m => m.IdUsuario)
                .GreaterThan(0).WithMessage("El ID del usuario debe ser mayor a 0");

            RuleFor(m => m.Cantidad)
                .GreaterThan(0).WithMessage("La cantidad debe ser mayor a 0");

            RuleFor(m => m.TipoMovimiento)
                .NotEmpty().WithMessage("El tipo de movimiento es obligatorio")
                .Must(tipo => tipo == "Entrada" || tipo == "Salida")
                .WithMessage("El tipo de movimiento debe de ser 'Entrada' o 'Salida'. ");
        }
    }
}
