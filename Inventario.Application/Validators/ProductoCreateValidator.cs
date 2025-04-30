using FluentValidation;
using Inventario.API.DTOs;
namespace Inventario.API.Validators
{
    public class ProductoCreateValidator : AbstractValidator<ProductoCreateDTO>
    {
        public ProductoCreateValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");
            RuleFor(x => x.Descripcion)
                .NotEmpty().WithMessage("La descripción es obligatoria.");
            RuleFor(x => x.PrecioUnitario)
                .GreaterThan(0).WithMessage("El precio unitario debe ser mayor que cero.");
            RuleFor(x => x.Stock)
                .GreaterThanOrEqualTo(0).WithMessage("El stock no puede ser negativo.");
            RuleFor(x => x.IdCategoria)
                .GreaterThan(0).WithMessage("La categoría es obligatoria.");
        }
    }
}
