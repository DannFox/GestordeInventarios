import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es admin
  const pageSize = 10; // Tamaño de página
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] === "Admin"
        );
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }

    const fetchProductosYCategorias = async () => {
      try {
        const [productosResponse, categoriasResponse] = await Promise.all([
          fetch(`http://localhost:5074/api/Products?Page=${currentPage}&PageSize=${pageSize}`, {
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
        setTotalPages(1); // Si no hay paginación en la respuesta, asumimos una sola página
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos y categorías:", error);
        setProductos([]);
        setLoading(false);
      }
    };

    fetchProductosYCategorias();
  }, [currentPage]);

  const handleAddProduct = () => {
    navigate("/productos/nuevo");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleViewProduct = (idProducto) => {
    navigate(`/productos/${idProducto}`);
  };

  const handleEditProduct = (idProducto) => {
    navigate(`/productos/editar/${idProducto}`);
  };

  const handleDeleteProduct = async (idProducto) => {
    if (!idProducto) {
      alert("No se pudo eliminar el producto. ID no válido.");
      return;
    }

    const token = localStorage.getItem("token");

    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`http://localhost:5074/api/Products/${idProducto}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        setProductos(productos.filter((producto) => producto.idProducto !== idProducto));
        alert("Producto eliminado exitosamente.");
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("No se pudo eliminar el producto. Inténtalo de nuevo.");
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
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
            {filteredProductos.map((producto) => (
              <tr key={producto.idProducto} className="border-b">
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
                    onClick={() => handleViewProduct(producto.idProducto)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Ver
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditProduct(producto.idProducto)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(producto.idProducto)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Anterior
        </button>
        <span className="text-lg font-bold">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Productos;