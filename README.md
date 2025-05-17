# Inventario API

Inventario API es un servicio RESTful para la gesti�n de productos, categor�as y usuarios en un sistema de inventario. Desarrollado con .NET 8, soporta autenticaci�n, autorizaci�n basada en roles, manejo de im�genes de productos y paginaci�n en los endpoints.

## Caracter�sticas

- **Productos**: Operaciones CRUD, carga y visualizaci�n de im�genes, filtrado por categor�a.
- **Categor�as**: Operaciones CRUD, listado de productos por categor�a.
- **Usuarios**: Registro, gesti�n de roles, restablecimiento de contrase�a/correo, endpoints solo para administradores.
- **Autenticaci�n**: Basada en JWT, con control de acceso por roles.
- **Paginaci�n**: Todos los endpoints de listado soportan paginaci�n con metadatos en los encabezados de la respuesta.
- **Manejo de Im�genes**: Las im�genes de productos se almacenan en `wwwroot/images` y se sirven como archivos est�ticos.

## Primeros Pasos

### Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server (o base de datos compatible)
- (Opcional) [Swagger UI](https://swagger.io/tools/swagger-ui/) para explorar la API

### Instalaci�n

1. **Clona el repositorio**

2. **Configura la base de datos**
   - Actualiza la cadena de conexi�n en `appsettings.json` seg�n tu entorno.

3. **Aplica las migraciones**

4. **Ejecuta la API**

5. **Accede a Swagger UI**
   - Ingresa a `https://localhost:<puerto>/swagger` en tu navegador.

## Documentaci�n de la API

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
  Lista productos por categor�a.

### Categor�as

- `GET /api/Categoria`  
  Lista categor�as (paginado).

- `GET /api/Categoria/{id}`  
  Obtiene una categor�a por ID.

- `GET /api/Categoria/{id}/productos`  
  Obtiene una categor�a con sus productos.

- `POST /api/Categoria`  
  Crea una categor�a (solo Admin).

- `PUT /api/Categoria/{id}`  
  Actualiza una categor�a (solo Admin).

- `DELETE /api/Categoria/{id}`  
  Elimina una categor�a (solo Admin).

### Usuarios

- `GET /api/Usuario`  
  Lista usuarios (solo Admin, paginado).

- `POST /api/Usuario`  
  Registra un nuevo usuario.

- `PUT /api/Usuario/{id}/CambiarEmail`  
  Restablece el correo de un usuario (solo Admin).

- `PUT /api/Usuario/{id}/CambiarPassword`  
  Restablece la contrase�a de un usuario (solo Admin).

- `DELETE /api/Usuario/{id}`  
  Elimina un usuario (solo Admin).

- `GET /api/Usuario/PorRol/{idRol}`  
  Lista usuarios por rol (solo Admin).

- `PUT /api/Usuario/{id}/CambiarRol`  
  Cambia el rol de un usuario (solo Admin).

## Im�genes de Productos

- Las im�genes se cargan mediante los endpoints de productos y se almacenan en `wwwroot/images`.
- La API retorna una URL relativa (por ejemplo, `/images/archivo.jpg`) en la propiedad `UrlImagenString`.
- Las im�genes son accesibles v�a `https://<host>/images/<archivo>`.

## Paginaci�n

Todos los endpoints de listado retornan metadatos de paginaci�n en los encabezados de la respuesta:
- `X-Total-Count`: Total de elementos
- `X-Total-Pages`: Total de p�ginas
- `X-Current-Page`: P�gina actual
- `X-Page-Size`: Tama�o de p�gina

## Seguridad

- Los endpoints est�n protegidos con autenticaci�n JWT.
- La autorizaci�n por roles se aplica en operaciones sensibles (gesti�n de usuarios y categor�as).

---

**Para m�s detalles, consulta el c�digo fuente y los comentarios XML en cada controlador y servicio.**