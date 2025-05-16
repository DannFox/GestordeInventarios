import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowLeftCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ nombre: "" });
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleUsers, setRoleUsers] = useState([]);
  const [showRoleDetails, setShowRoleDetails] = useState(false);
  const navigate = useNavigate();

  // Función para obtener la lista de roles
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

  useEffect(() => {
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
        body: JSON.stringify({ nombre: newRole.nombre }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el rol");
      }

      const addedRole = await response.json();
      setRoles((prevRoles) => [...prevRoles, addedRole]);
      setShowModal(false);
      setNewRole({ nombre: "" });
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

      setRoles((prevRoles) => prevRoles.filter((role) => role.idRol !== id));
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
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <ArrowLeftCircleIcon className="h-5 w-5" />
          Volver al Dashboard
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Agregar Rol
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center text-green-600 mb-6 flex items-center gap-2 justify-center">
        <UserGroupIcon className="h-7 w-7" />
        Gestión de Roles
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <UserIcon className="h-5 w-5" /> Nombre
                </span>
              </th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.idRol} className="border-b hover:bg-green-50 transition-colors duration-200">
                <td className="px-4 py-2 text-center">{role.nombre}</td>
                <td className="px-4 py-2 text-center flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleDeleteRole(role.idRol)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      fetchRoleUsers(role.idRol);
                    }}
                    className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Ver Usuarios"
                  >
                    <UserGroupIcon className="h-5 w-5" />
                    Ver Usuarios
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar rol */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircleIcon className="h-6 w-6 text-green-600" />
              Agregar Rol
            </h2>
            <input
              type="text"
              placeholder="Nombre del rol"
              value={newRole.nombre}
              onChange={(e) => setNewRole({ ...newRole, nombre: e.target.value })}
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRole}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver usuarios del rol */}
      {showRoleDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
              Usuarios del Rol: {selectedRole?.nombre}
            </h2>
            <ul className="mb-4">
              {roleUsers.length > 0 ? (
                roleUsers.map((user) => (
                  <li key={user.id} className="border-b py-2 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-green-500" />
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
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
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

export default GestionRoles;