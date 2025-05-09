import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NuevoProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    nombreCategoria: "",
    stock: 0,
    precioUnitario: 0,
  });
  const [imagen, setImagen] = useState(null); // Archivo de imagen
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file); // Guardar el archivo de imagen en el estado
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Paso 1: Crear el producto
      const responseProducto = await fetch("http://localhost:5074/api/Products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!responseProducto.ok) {
        throw new Error("Error al agregar el producto");
      }

      const productoCreado = await responseProducto.json();
      const productoId = productoCreado.id; // Obtener el ID del producto creado

      // Paso 2: Subir la imagen asociada al producto
      if (imagen) {
        const formData = new FormData();
        formData.append("file", imagen);

        const responseImagen = await fetch(
          `http://localhost:5074/api/Imagen/${productoId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!responseImagen.ok) {
          throw new Error("Error al subir la imagen");
        }
      }

      // Redirigir a la lista de productos después de agregar
      navigate("/productos");
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo agregar el producto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Agregar Producto
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Categoría:</label>
            <input
              type="text"
              name="nombreCategoria"
              value={producto.nombreCategoria}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Stock:</label>
            <input
              type="number"
              name="stock"
              value={producto.stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Precio Unitario:
            </label>
            <input
              type="number"
              name="precioUnitario"
              value={producto.precioUnitario}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/productos")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProducto;