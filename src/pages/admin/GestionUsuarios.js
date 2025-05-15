import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", correo: "", rol: "" });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchUsuarios = useCallback(async () => {
    const token = localStorage.getItem("token");

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
      setUsuarios(data.items || data);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleChangePassword = (id) => {
    const nuevaContrasena = prompt("Ingresa la nueva contraseña:");
    if (!nuevaContrasena) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Usuario/${id}/CambiarPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nuevaContrasena }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cambiar la contraseña");
        }
        alert("Contraseña actualizada exitosamente.");
      })
      .catch(() => {
        alert("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
      });
  };

  const handleChangeEmail = (id) => {
    const correo = prompt("Ingresa el nuevo correo electrónico:");
    if (!correo) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5074/api/Usuario/${id}/CambiarEmail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ correo }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Error al cambiar el correo");
        }

        try {
          return await response.json();
        } catch {
          return { correo };
        }
      })
      .then((data) => {
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.idUsuario === id ? { ...usuario, correo: data.correo } : usuario
          )
        );
        alert("Correo actualizado exitosamente.");
      })
      .catch(() => {
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
        return response.text();
      })
      .then(() => {
        fetchUsuarios();
        alert("Usuario eliminado exitosamente.");
      })
      .catch(() => {
        alert("No se pudo eliminar el usuario. Inténtalo de nuevo.");
      });
  };

  const handleAddUser = async () => {
    if (!newUser.nombre || !newUser.correo || !newUser.contrasena || !newUser.idRol) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5074/api/Usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el usuario");
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        await response.json();
      } else {
        alert(await response.text());
      }

      await fetchUsuarios();
      setShowModal(false);
      alert("Usuario agregado exitosamente.");
    } catch {
      alert("No se pudo agregar el usuario. Inténtalo de nuevo.");
    }
  };

  const handleChangeRole = async () => {
    if (!newRole) {
      alert("Por favor, selecciona un rol.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5074/api/Usuario/${selectedUser.idUsuario}/CambiarRol`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idRol: parseInt(newRole) }),
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el rol del usuario");
      }

      alert("Rol actualizado exitosamente.");
      setShowRoleModal(false);
      fetchUsuarios();
    } catch {
      alert("No se pudo cambiar el rol. Inténtalo de nuevo.");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando usuarios...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver al Dashboard
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Agregar Usuario
        </button>
      </div>

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
            {usuarios.map((usuario) => {
              return (
                <tr key={usuario.idUsuario} className="border-b">
                  <td className="px-4 py-2 text-center">{usuario.nombre}</td>
                  <td className="px-4 py-2 text-center">{usuario.correo}</td>
                  <td className="px-4 py-2 text-center">{usuario.rol}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleChangePassword(usuario.idUsuario)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Cambiar Contraseña
                    </button>
                    <button
                      onClick={() => handleChangeEmail(usuario.idUsuario)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Cambiar Correo
                    </button>
                    <button
                      onClick={() => handleDeleteUsuario(usuario.idUsuario)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(usuario);
                        setShowRoleModal(true);
                      }}
                      className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                    >
                      Cambiar Rol
                    </button>
                  </td>
                </tr>
              );
            })}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Agregar Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newUser.nombre}
              onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Correo"
              value={newUser.correo}
              onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={newUser.contrasena || ""}
              onChange={(e) => setNewUser({ ...newUser, contrasena: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={newUser.idRol || 0}
              onChange={(e) => setNewUser({ ...newUser, idRol: parseInt(e.target.value) })}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value={0} disabled>
                Selecciona un rol
              </option>
              <option value={1}>Administrador</option>
              <option value={2}>Vendedor</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddUser}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Cambiar Rol de Usuario</h2>
            <p className="mb-4">Usuario: {selectedUser?.nombre}</p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="" disabled>
                Selecciona un rol
              </option>
              <option value={1}>Administrador</option>
              <option value={2}>Vendedor</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangeRole}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;