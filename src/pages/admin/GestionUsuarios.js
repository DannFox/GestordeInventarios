import React, { useState, useEffect } from "react";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const pageSize = 10; // Tamaño de página

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(
          `http://localhost:5074/api/Usuario?Page=${currentPage}&PageSize=${pageSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const data = await response.json();
        setUsuarios(data.items || data); // Si la API devuelve `items`, úsalo; de lo contrario, usa `data`.
        setTotalPages(data.totalPages || 1); // Si la API devuelve `totalPages`, úsalo; de lo contrario, asume 1.
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [currentPage]); // Ejecutar el efecto cuando cambie la página actual

  const handleChangePassword = (id) => {
    const nuevaPassword = prompt("Ingresa la nueva contraseña:");
    if (!nuevaPassword) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Usuarios/${id}/CambiarPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nuevaPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cambiar la contraseña");
        }
        alert("Contraseña actualizada exitosamente.");
      })
      .catch((error) => {
        console.error("Error al cambiar la contraseña:", error);
        alert("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
      });
  };

  const handleChangeEmail = (id) => {
    const nuevoEmail = prompt("Ingresa el nuevo correo electrónico:");
    if (!nuevoEmail) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Usuarios/${id}/CambiarEmail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nuevoEmail }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cambiar el correo");
        }
        return response.json();
      })
      .then((usuarioActualizado) => {
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.id === id ? { ...usuario, email: usuarioActualizado.email } : usuario
          )
        );
        alert("Correo actualizado exitosamente.");
      })
      .catch((error) => {
        console.error("Error al cambiar el correo:", error);
        alert("No se pudo cambiar el correo. Inténtalo de nuevo.");
      });
  };

  const handleDeleteUsuario = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Usuario/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar el usuario");
        }
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        alert("Usuario eliminado exitosamente.");
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
        alert("No se pudo eliminar el usuario. Inténtalo de nuevo.");
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
        <h1 className="text-3xl font-bold">Cargando usuarios...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
        Gestión de Usuarios
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b">
                <td className="px-4 py-2 text-center">{usuario.nombre}</td>
                <td className="px-4 py-2 text-center">{usuario.correo}</td>
                <td className="px-4 py-2 text-center">{usuario.rol}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleChangePassword(usuario.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Cambiar Contraseña
                  </button>
                  <button
                    onClick={() => handleChangeEmail(usuario.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Cambiar Correo
                  </button>
                  <button
                    onClick={() => handleDeleteUsuario(usuario.id)}
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

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-400" : "bg-green-600 text-white hover:bg-green-700"
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
            currentPage === totalPages ? "bg-gray-400" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default GestionUsuarios;