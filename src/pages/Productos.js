import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchProductosYCategorias = async () => {
    try {
      const [productosResponse, categoriasResponse] = await Promise.all([
        fetch("http://localhost:5074/api/Products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:5074/api/Categoria", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!productosResponse.ok || !categoriasResponse.ok) {
        throw new Error("Error al obtener productos o categorías");
      }

      const productosData = await productosResponse.json();
      const categoriasData = await categoriasResponse.json();

      // Combina los productos con los nombres de las categorías
      const productosConNombreCategoria = productosData.map((producto) => {
        const categoria = categoriasData.find(
          (cat) => cat.id_categoria === producto.idCategoria
        );
        return {
          ...producto,
          nombreCategoria: categoria ? categoria.nombre : "Sin categoría",
        };
      });

      setProductos(productosConNombreCategoria);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener productos y categorías:", error);
      setLoading(false);
    }
  };

  fetchProductosYCategorias();
}, []);

  const handleAddProduct = () => {
    navigate("/productos/nuevo"); // Redirige al formulario de agregar producto
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard"); // Redirige al Dashboard
  };

  const handleViewProduct = (id) => {
    navigate(`/productos/${id}`); // Redirige a la página de detalles del producto
  };

  const handleEditProduct = (id) => {
    navigate(`/productos/editar/${id}`); // Redirige al formulario de edición del producto
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`http://localhost:5074/api/Products/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        // Actualiza la lista de productos después de eliminar
        setProductos(productos.filter((producto) => producto.id !== id));
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("No se pudo eliminar el producto. Inténtalo de nuevo.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando productos...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
        Lista de Productos
      </h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleGoToDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Ir al Dashboard
        </button>
        <button
          onClick={handleAddProduct}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Agregar Producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Precio Unitario</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b">
                <td className="px-4 py-2 text-center">{producto.nombre}</td>
                <td className="px-4 py-2 text-center">{producto.descripcion}</td>
                <td className="px-4 py-2 text-center">{producto.nombreCategoria}</td>
                <td className="px-4 py-2 text-center">{producto.stock}</td>
                <td className="px-4 py-2 text-center">
                  {producto.precioUnitario.toLocaleString("es-EC", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewProduct(producto.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleEditProduct(producto.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(producto.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;