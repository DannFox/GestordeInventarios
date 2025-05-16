import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  ArrowLeftCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon, // <-- Agrega esta línea
} from "@heroicons/react/24/outline";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const pageSize = 10;
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
          fetch(
            `http://localhost:5074/api/Products?Page=${currentPage}&PageSize=${pageSize}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ),
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
        const response = await fetch(
          `http://localhost:5074/api/Products/${idProducto}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        setProductos(
          productos.filter((producto) => producto.idProducto !== idProducto)
        );
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
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8 flex items-center justify-center gap-2">
        <ClipboardDocumentListIcon className="h-8 w-8 text-green-600" />
        Lista de Productos
      </h1>
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleGoToDashboard}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <ArrowLeftCircleIcon className="h-5 w-5" />
          Ir al Dashboard
        </button>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Agregar Producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <CubeIcon className="h-5 w-5" /> Nombre
                </span>
              </th>
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <TagIcon className="h-5 w-5" /> Descripción
                </span>
              </th>
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <ClipboardDocumentListIcon className="h-5 w-5" /> Categoría
                </span>
              </th>
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <ArchiveBoxIcon className="h-5 w-5" /> Stock
                </span>
              </th>
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <CurrencyDollarIcon className="h-5 w-5" /> Precio Unitario
                </span>
              </th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => (
              <tr
                key={producto.idProducto}
                className="border-b hover:bg-green-50 transition-colors duration-200"
              >
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
                <td className="px-4 py-2 text-center flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleViewProduct(producto.idProducto)}
                    className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Ver"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditProduct(producto.idProducto)}
                        className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95"
                        title="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(producto.idProducto)}
                        className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
          }`}
        >
          <ArrowLeftCircleIcon className="h-5 w-5" />
          Anterior
        </button>
        <span className="text-lg font-bold">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
          }`}
        >
          Siguiente
          <ArrowLeftCircleIcon className="h-5 w-5 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Productos;