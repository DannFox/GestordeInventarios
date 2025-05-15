import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoria, setSelectedCategoria] = useState(null); // Categoría seleccionada
  const [categoriaProductos, setCategoriaProductos] = useState([]); // Productos de la categoría seleccionada
  const [showCategoriaDetails, setShowCategoriaDetails] = useState(false); // Mostrar/ocultar modal de detalles
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

    try {
      const response = await fetch(`http://localhost:5074/api/Products/PorCategoria/${idCategoria}`, {
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
      setCategoriaProductos(data);
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
          { idCategoria: categoriaAgregada.idCategoria, nombre: categoriaAgregada.nombre },
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
          prevCategorias.filter((categoria) => categoria.idCategoria !== id)
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
            categoria.idCategoria === id
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando categorías...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver al Dashboard
        </button>
      </div>

      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Gestión de Categorías
        </h1>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Agregar Categoría</h2>
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.idCategoria} className="border-b">
                <td className="px-4 py-2 text-center">{categoria.nombre}</td>
                <td className="px-4 py-2 text-center">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          const nuevoNombre = prompt("Nuevo nombre de la categoría:", categoria.nombre);
                          if (!nuevoNombre) {
                            alert("El nombre de la categoría no puede estar vacío.");
                            return;
                          }
                          handleUpdateCategoria(categoria.idCategoria, nuevoNombre);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategoria(categoria.idCategoria)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategoria(categoria);
                      fetchCategoriaProductos(categoria.idCategoria);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
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

      {showCategoriaDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
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
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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