import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5074/api/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo: email,
          contrasena: password,
          IdRol: 2,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al registrar el usuario.");
        return;
      }

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError("Error del servidor.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <div className="bg-white shadow-2xl rounded-2xl flex w-full max-w-4xl overflow-hidden animate-fade-in">
        {/* Imagen o lado visual */}
        <div className="hidden md:flex flex-col justify-center items-center bg-green-600 text-white w-1/2 p-8">
          <img src="/register-icon.png" alt="Logo" className="mb-6 w-32 h-auto drop-shadow-lg animate-fade-in" />
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <UserPlusIcon className="h-7 w-7 text-white" />
            Únete a nosotros
          </h2>
          <p className="text-center text-lg">Crea una cuenta para gestionar tu inventario</p>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-all duration-200 w-fit"
          >
            <ArrowLeftCircleIcon className="h-5 w-5" />
            Volver al Login
          </button>
          <h2 className="text-2xl font-bold text-center text-green-600 mb-6 flex items-center gap-2 justify-center">
            <UserPlusIcon className="h-7 w-7" />
            Registro
          </h2>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                <UserPlusIcon className="h-5 w-5 text-green-500" />
                Nombre
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                <EnvelopeIcon className="h-5 w-5 text-green-500" />
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                <LockClosedIcon className="h-5 w-5 text-green-500" />
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                <LockClosedIcon className="h-5 w-5 text-green-500" />
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <UserPlusIcon className="h-5 w-5" />
              Registrarse
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-green-600 hover:underline font-semibold flex items-center gap-1 justify-center transition-all duration-200"
              >
                <LockClosedIcon className="h-5 w-5" />
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
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

export default Register;