import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const pageSize = 10; // Tamaño de página
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded Token:", decodedToken);
        setIsAdmin(
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] === "Admin"
        );
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
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
        setCategorias(data.items || data); // Si la API devuelve `items`, úsalo; de lo contrario, usa `data`.
        setTotalPages(data.totalPages || 1); // Si la API devuelve `totalPages`, úsalo; de lo contrario, asume 1.
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [currentPage]); // Ejecutar el efecto cuando cambie la página actual

  const handleAddCategoria = () => {
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
          throw new Error("Error al agregar la categoría");
        }
        return response.json();
      })
      .then((categoriaAgregada) => {
        setCategorias([...categorias, categoriaAgregada]);
        setNuevaCategoria("");
      })
      .catch((error) => {
        console.error("Error al agregar la categoría:", error);
      });
  };

  const handleDeleteCategoria = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Categoria/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la categoría");
        }
        setCategorias(categorias.filter((categoria) => categoria.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar la categoría:", error);
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
      body: JSON.stringify({ nombre: nuevoNombre }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar la categoría");
        }
        return response.json();
      })
      .then((categoriaActualizada) => {
        setCategorias(
          categorias.map((categoria) =>
            categoria.id_categoria === id ? categoriaActualizada : categoria
          )
        );
      })
      .catch((error) => {
        console.error("Error al actualizar la categoría:", error);
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
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              {isAdmin && <th className="px-4 py-2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria} className="border-b">
                <td className="px-4 py-2 text-center">{categoria.id_categoria}</td>
                <td className="px-4 py-2 text-center">{categoria.nombre}</td>
                {isAdmin && (
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        handleUpdateCategoria(
                          categoria.id_categoria,
                          prompt("Nuevo nombre de la categoría:", categoria.nombre)
                        )
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategoria(categoria.id_categoria)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
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

export default Categoria;