import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ nombre: "" });
  const [selectedRole, setSelectedRole] = useState(null); // Rol seleccionado
  const [roleUsers, setRoleUsers] = useState([]); // Usuarios del rol seleccionado
  const [showRoleDetails, setShowRoleDetails] = useState(false); // Mostrar/ocultar modal de detalles
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5074/api/Rol", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los roles");
        }

        const data = await response.json();
        setRoles(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const fetchRoleUsers = async (roleId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5074/api/Usuario/PorRol/${roleId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios del rol");
      }

      const data = await response.json();
      setRoleUsers(data);
      setShowRoleDetails(true);
    } catch (error) {
      console.error("Error al obtener los usuarios del rol:", error);
      alert("No se pudo obtener los usuarios del rol. Inténtalo de nuevo.");
    }
  };

  const handleAddRole = async () => {
    if (!newRole.nombre) {
      alert("Por favor, completa el nombre del rol.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5074/api/Rol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRole),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el rol");
      }

      const addedRole = await response.json();
      setRoles([...roles, addedRole]);
      setShowModal(false);
      alert("Rol agregado exitosamente.");
    } catch (error) {
      console.error("Error al agregar el rol:", error);
      alert("No se pudo agregar el rol. Inténtalo de nuevo.");
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este rol?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5074/api/Rol/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el rol");
      }

      setRoles(roles.filter((role) => role.id !== id));
      alert("Rol eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      alert("No se pudo eliminar el rol. Inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando roles...</h1>
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
          Agregar Rol
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
        Gestión de Roles
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.idRol} className="border-b">
                <td className="px-4 py-2 text-center">{role.nombre}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteRole(role.idRol)} // Usar idRol aquí también
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      fetchRoleUsers(role.idRol); // Usar idRol aquí
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Ver Usuarios
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Agregar Rol</h2>
            <input
              type="text"
              placeholder="Nombre del rol"
              value={newRole.nombre}
              onChange={(e) => setNewRole({ ...newRole, nombre: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRole}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoleDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Usuarios del Rol: {selectedRole?.nombre}
            </h2>
            <ul className="mb-4">
              {roleUsers.length > 0 ? (
                roleUsers.map((user) => (
                  <li key={user.id} className="border-b py-2">
                    {user.nombre} - {user.correo}
                  </li>
                ))
              ) : (
                <p>No hay usuarios asignados a este rol.</p>
              )}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRoleDetails(false)}
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

export default GestionRoles;