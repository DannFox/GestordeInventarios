import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  ArrowLeftCircleIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const NuevoProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    idCategoria: "",
    stock: 0,
    precioUnitario: 0,
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [urlImagen, setUrlImagen] = useState(null); // Nuevo estado para la imagen
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5074/api/Categoria", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        return response.json();
      })
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener las categorías:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // Nuevo handler para la imagen
  const handleImageChange = (e) => {
    setUrlImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("nombre", producto.nombre);
      formData.append("descripcion", producto.descripcion);
      formData.append("idCategoria", producto.idCategoria);
      formData.append("stock", producto.stock);
      formData.append("precioUnitario", producto.precioUnitario);
      if (urlImagen) {
        formData.append("UrlImagen", urlImagen); // Nombre del campo según tu requerimiento
      }

      const responseProducto = await fetch("http://localhost:5074/api/Products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!responseProducto.ok) {
        throw new Error("Error al agregar el producto");
      }

      navigate("/productos");
    } catch (error) {
      setError("No se pudo agregar el producto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
        <button
          type="button"
          onClick={() => navigate("/productos")}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-4 transition-all duration-200"
        >
          <ArrowLeftCircleIcon className="h-5 w-5" />
          Volver a Productos
        </button>
        <h1 className="text-2xl font-bold text-green-600 mb-6 text-center flex items-center gap-2 justify-center">
          <PlusCircleIcon className="h-7 w-7" />
          Agregar Producto
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
              <TagIcon className="h-5 w-5 text-green-500" />
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
              <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" />
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={producto.descripcion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
              <Squares2X2Icon className="h-5 w-5 text-green-500" />
              Categoría
            </label>
            <select
              name="idCategoria"
              value={producto.idCategoria}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
              <ArchiveBoxIcon className="h-5 w-5 text-green-500" />
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={producto.stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
              <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
              Precio Unitario
            </label>
            <input
              type="number"
              name="precioUnitario"
              value={producto.precioUnitario}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              min={0}
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
              Imagen
            </label>
            <input
              type="file"
              name="UrlImagen"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/productos")}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeftCircleIcon className="h-5 w-5" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Agregar
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default NuevoProducto;