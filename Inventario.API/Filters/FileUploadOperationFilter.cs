using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Inventario.API.Filters
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileParameter = context.ApiDescription.ParameterDescriptions
                .Any(p => p.ModelMetadata.ModelType == typeof(IFormFile));

            if (fileParameter)
            {
                operation.RequestBody = new OpenApiRequestBody
                {
                    Content = new Dictionary<string, OpenApiMediaType>
                    {
                        ["multipart/form-data"] = new OpenApiMediaType
                        {
                            Schema = new OpenApiSchema
                            {
                                Type = "object",
                                Properties =
                                    {
                                        ["file"] = new OpenApiSchema
                                        {
                                            Type = "string",
                                            Format = "binary"
                                        },
                                        ["idProducto"] = new OpenApiSchema
                                        {
                                            Type = "integer",
                                            Format = "int32"
                                        }
                                    },
                                Required = new HashSet<string> { "file", "idProducto" }
                            }
                        }
                    }
                };
            }
        }
    }
}
