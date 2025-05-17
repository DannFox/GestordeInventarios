# Inventario API

Inventario API es un servicio RESTful para la gestión de productos, categorías y usuarios en un sistema de inventario. Desarrollado con .NET 8, soporta autenticación, autorización basada en roles, manejo de imágenes de productos y paginación en los endpoints.

## Características

- **Productos**: Operaciones CRUD, carga y visualización de imágenes, filtrado por categoría.
- **Categorías**: Operaciones CRUD, listado de productos por categoría.
- **Usuarios**: Registro, gestión de roles, restablecimiento de contraseña/correo, endpoints solo para administradores.
- **Autenticación**: Basada en JWT, con control de acceso por roles.
- **Paginación**: Todos los endpoints de listado soportan paginación con metadatos en los encabezados de la respuesta.
- **Manejo de Imágenes**: Las imágenes de productos se almacenan en `wwwroot/images` y se sirven como archivos estáticos.

## Primeros Pasos

### Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server (o base de datos compatible)
- (Opcional) [Swagger UI](https://swagger.io/tools/swagger-ui/) para explorar la API

### Instalación

1. **Clona el repositorio**

2. **Configura la base de datos**
   - Actualiza la cadena de conexión en `appsettings.json` según tu entorno.

3. **Aplica las migraciones**

4. **Ejecuta la API**

5. **Accede a Swagger UI**
   - Ingresa a `https://localhost:<puerto>/swagger` en tu navegador.

## Documentación de la API

### Productos

- `GET /api/Products`  
  Lista productos (paginado).  
  **Encabezados:**  
  - `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`, `X-Page-Size`

- `GET /api/Products/{id}`  
  Obtiene un producto por ID (incluye URL de la imagen).

- `POST /api/Products`  
  Crea un producto (usar multipart/form-data para cargar imagen).

- `PUT /api/Products/{id}`  
  Actualiza un producto.

- `DELETE /api/Products/{id}`  
  Elimina un producto.

- `GET /api/Products/PorCategoria/{idCategoria}`  
  Lista productos por categoría.

### Categorías

- `GET /api/Categoria`  
  Lista categorías (paginado).

- `GET /api/Categoria/{id}`  
  Obtiene una categoría por ID.

- `GET /api/Categoria/{id}/productos`  
  Obtiene una categoría con sus productos.

- `POST /api/Categoria`  
  Crea una categoría (solo Admin).

- `PUT /api/Categoria/{id}`  
  Actualiza una categoría (solo Admin).

- `DELETE /api/Categoria/{id}`  
  Elimina una categoría (solo Admin).

### Usuarios

- `GET /api/Usuario`  
  Lista usuarios (solo Admin, paginado).

- `POST /api/Usuario`  
  Registra un nuevo usuario.

- `PUT /api/Usuario/{id}/CambiarEmail`  
  Restablece el correo de un usuario (solo Admin).

- `PUT /api/Usuario/{id}/CambiarPassword`  
  Restablece la contraseña de un usuario (solo Admin).

- `DELETE /api/Usuario/{id}`  
  Elimina un usuario (solo Admin).

- `GET /api/Usuario/PorRol/{idRol}`  
  Lista usuarios por rol (solo Admin).

- `PUT /api/Usuario/{id}/CambiarRol`  
  Cambia el rol de un usuario (solo Admin).

## Imágenes de Productos

- Las imágenes se cargan mediante los endpoints de productos y se almacenan en `wwwroot/images`.
- La API retorna una URL relativa (por ejemplo, `/images/archivo.jpg`) en la propiedad `UrlImagenString`.
- Las imágenes son accesibles vía `https://<host>/images/<archivo>`.

## Paginación

Todos los endpoints de listado retornan metadatos de paginación en los encabezados de la respuesta:
- `X-Total-Count`: Total de elementos
- `X-Total-Pages`: Total de páginas
- `X-Current-Page`: Página actual
- `X-Page-Size`: Tamaño de página

## Seguridad

- Los endpoints están protegidos con autenticación JWT.
- La autorización por roles se aplica en operaciones sensibles (gestión de usuarios y categorías).

---

**Para más detalles, consulta el código fuente y los comentarios XML en cada controlador y servicio.**