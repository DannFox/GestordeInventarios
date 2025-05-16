import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowLeftCircleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  KeyIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", correo: "", contrasena: "", idRol: 0 });
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

  // Exportar usuarios a Excel
  const exportarExcel = () => {
    const datos = usuarios.map((u) => ({
      Nombre: u.nombre,
      Correo: u.correo,
      Rol: u.rol,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "usuarios.xlsx");
  };

  // Exportar usuarios a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Usuarios", 14, 16);
    const tableColumn = ["Nombre", "Correo", "Rol"];
    const tableRows = usuarios.map((u) => [u.nombre, u.correo, u.rol]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 10 },
    });
    doc.save("usuarios.pdf");
  };

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
      const response = await fetch(
        `http://localhost:5074/api/Usuario/${selectedUser.idUsuario}/CambiarRol`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idRol: parseInt(newRole) }),
        }
      );

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
      <div className="mb-4 flex flex-col md:flex-row justify-between gap-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <ArrowLeftCircleIcon className="h-5 w-5" />
          Volver al Dashboard
        </button>
        <div className="flex gap-2">
          <button
            onClick={exportarExcel}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Exportar Excel
          </button>
          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Exportar PDF
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Agregar Usuario
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center text-green-600 mb-6 flex items-center gap-2 justify-center">
        <UserGroupIcon className="h-7 w-7" />
        Gestión de Usuarios
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <UserGroupIcon className="h-5 w-5" /> Nombre
                </span>
              </th>
              <th className="px-4 py-2 text-center">
                <span className="flex items-center gap-1 justify-center">
                  <EnvelopeIcon className="h-5 w-5" /> Correo
                </span>
              </th>
              <th className="px-4 py-2 text-center">Rol</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              return (
                <tr key={usuario.idUsuario} className="border-b hover:bg-green-50 transition-colors duration-200">
                  <td className="px-4 py-2 text-center">{usuario.nombre}</td>
                  <td className="px-4 py-2 text-center">{usuario.correo}</td>
                  <td className="px-4 py-2 text-center">{usuario.rol}</td>
                  <td className="px-4 py-2 text-center flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleChangePassword(usuario.idUsuario)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Cambiar Contraseña"
                    >
                      <KeyIcon className="h-5 w-5" />
                      Contraseña
                    </button>
                    <button
                      onClick={() => handleChangeEmail(usuario.idUsuario)}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Cambiar Correo"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                      Correo
                    </button>
                    <button
                      onClick={() => handleDeleteUsuario(usuario.idUsuario)}
                      className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(usuario);
                        setShowRoleModal(true);
                      }}
                      className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Cambiar Rol"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      Rol
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95"
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95"
          }`}
        >
          Siguiente
        </button>
      </div>

      {/* Modal para agregar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircleIcon className="h-6 w-6 text-blue-600" />
              Agregar Usuario
            </h2>
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
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddUser}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar rol */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PencilSquareIcon className="h-6 w-6 text-purple-600" />
              Cambiar Rol de Usuario
            </h2>
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
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRoleModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangeRole}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Guardar
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

export default GestionUsuarios;