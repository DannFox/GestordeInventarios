//using Inventario.Application.Interfaces;
//using Inventario.Application.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace Inventario.API.API
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    //[Authorize]
//    public class ImagenController : ControllerBase
//    {
//        private readonly IImageService _imagenService;

//        public ImagenController(IImageService imagenService)
//        {
//            _imagenService = imagenService;
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            var imagenes = await _imagenService.GetAllAsync();
//            return Ok(imagenes);
//        }

//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetById(int id)
//        {
//            var imagen = await _imagenService.GetByIdAsync(id);
//            return Ok(imagen);
//        }

//        [HttpPost("{idProducto}")]
//        public async Task<IActionResult> Upload([FromForm] IFormFile file, int idProducto)
//        {
//            var fileName = await _imagenService.UploadAsync(file, idProducto);
//            return Ok(new { FileName = fileName });
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            await _imagenService.DeleteAsync(id);
//            return Ok("Imagen eliminada exitosamente.");
//        }
//    }
//}
