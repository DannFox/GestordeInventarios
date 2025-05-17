# Sistema de Gestión de Inventario

Este proyecto es una aplicación web desarrollada en React para la gestión de inventario de productos, categorías y usuarios. Permite a los usuarios autenticados (y administradores) realizar operaciones CRUD sobre productos, categorías y usuarios, así como visualizar estadísticas y exportar datos.

## Características principales

- **Autenticación de usuarios** (login y registro)
- **Gestión de productos**: agregar, editar, eliminar, ver detalles y subir imágenes
- **Gestión de categorías**: crear, editar, eliminar y ver productos por categoría
- **Gestión de usuarios y roles** (solo administradores)
- **Dashboard** con estadísticas y gráficos
- **Exportación de datos** a Excel y PDF
- **Interfaz moderna** con Tailwind CSS

## Estructura del proyecto

- `src/pages/`: Páginas principales de la aplicación (productos, categorías, dashboard, login, etc.)
- `src/components/`: Componentes reutilizables (rutas protegidas, etc.)
- `src/Footer.js`: Pie de página común
- `public/`: Archivos estáticos e imágenes

## Instalación y ejecución

1. Instala las dependencias:
   ```sh
   npm install
   ```
2. Inicia la aplicación:
   ```sh
   npm start
   ```
3. Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.

## Requisitos

- Node.js y npm instalados
- Backend corriendo en `http://localhost:5074` (API REST compatible)

## Integrantes

- Ulises Salinas
- Daniel Bonilla
- Christian Lopez

---
