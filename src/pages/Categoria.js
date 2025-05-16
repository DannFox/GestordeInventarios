import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  ArrowLeftCircleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoriaProductos, setCategoriaProductos] = useState([]);
  const [showCategoriaDetails, setShowCategoriaDetails] = useState(false);
  const [busqueda, setBusqueda] = useState(""); // Nuevo estado para el buscador
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
      } catch (error) {}
    }

    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          `http://localhost:5074/api/Categoria?Page=${currentPage}&PageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }

        const data = await response.json();
        setCategorias(data.items || data);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [currentPage]);

  const fetchCategoriaProductos = async (idCategoria) => {
    const token = localStorage.getItem("token");

    if (!idCategoria) {
      alert("ID de categoría inválido.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5074/api/Categoria/${idCategoria}/productos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los productos de la categoría");
      }

      const data = await response.json();
      setCategoriaProductos(data.productos || []);
      setShowCategoriaDetails(true);
    } catch (error) {
      console.error("Error al obtener los productos de la categoría:", error);
      alert("No se pudo obtener los productos de la categoría. Inténtalo de nuevo.");
    }
  };

  const handleAddCategoria = () => {
    if (!nuevaCategoria.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5074/api/Categoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: nuevaCategoria }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Error al agregar la categoría: ${text}`);
          });
        }
        return response.json();
      })
      .then((categoriaAgregada) => {
        setCategorias((prevCategorias) => [
          ...prevCategorias,
          { id_categoria: categoriaAgregada.idCategoria, nombre: categoriaAgregada.nombre },
        ]);
        setNuevaCategoria(""); // Limpiar el campo de entrada
        alert("Categoría agregada exitosamente.");
      })
      .catch(() => {
        alert("No se pudo agregar la categoría. Inténtalo de nuevo.");
      });
  };

  const handleDeleteCategoria = (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
    );

    if (!confirmDelete) {
      return; // Si el usuario cancela, no se realiza la eliminación
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Categoria/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar la categoría: ${errorText}`);
        }

        setCategorias((prevCategorias) =>
          prevCategorias.filter((categoria) => categoria.id_categoria !== id)
        );

        alert("Categoría eliminada exitosamente.");
      })
      .catch(() => {
        alert("No se pudo eliminar la categoría. Inténtalo de nuevo.");
      });
  };

  const handleUpdateCategoria = (id, nuevoNombre) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Categoria/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoNombre),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar la categoría");
        }
        return response.json();
      })
      .then(() => {
        setCategorias(
          categorias.map((categoria) =>
            categoria.id_categoria === id
              ? { ...categoria, nombre: nuevoNombre }
              : categoria
          )
        );
      })
      .catch(() => {
        alert("No se pudo actualizar la categoría. Inténtalo de nuevo.");
      });
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

  // Filtrar categorías por nombre según la búsqueda
  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando categorías...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <ArrowLeftCircleIcon className="h-5 w-5" />
          Volver al Dashboard
        </button>
      </div>

      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Squares2X2Icon className="h-7 w-7" />
          Gestión de Categorías
        </h1>
      </div>

      {/* Buscador de categorías */}
      <div className="flex justify-center mb-6">
        <div className="relative w-1/2">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar categoría por nombre..."
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
          />
        </div>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <PlusCircleIcon className="h-6 w-6" />
            Agregar Categoría
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full px-3 py-2 border rounded"
            />
            <button
              onClick={handleAddCategoria}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Agregar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <ClipboardDocumentListIcon className="h-5 w-5" /> Nombre
                </span>
              </th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((categoria) => (
              <tr key={categoria.id_categoria} className="border-b hover:bg-blue-50 transition-colors duration-200">
                <td className="px-4 py-2 text-center">{categoria.nombre}</td>
                <td className="px-4 py-2 text-center flex flex-wrap gap-2 justify-center">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          const nuevoNombre = prompt("Nuevo nombre de la categoría:", categoria.nombre);
                          if (!nuevoNombre) {
                            alert("El nombre de la categoría no puede estar vacío.");
                            return;
                          }
                          handleUpdateCategoria(categoria.id_categoria, nuevoNombre);
                        }}
                        className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95"
                        title="Editar"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategoria(categoria.id_categoria)}
                        className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                        Eliminar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategoria(categoria);
                      fetchCategoriaProductos(categoria.id_categoria);
                    }}
                    className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Ver Productos"
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    Ver Productos
                  </button>
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

      {showCategoriaDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              Productos de la Categoría: {selectedCategoria?.nombre}
            </h2>
            <ul className="mb-4">
              {categoriaProductos.length > 0 ? (
                categoriaProductos.map((producto) => (
                  <li key={producto.id} className="border-b py-2">
                    {producto.nombre} - {producto.descripcion}
                  </li>
                ))
              ) : (
                <p>No hay productos asignados a esta categoría.</p>
              )}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowCategoriaDetails(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categoria;