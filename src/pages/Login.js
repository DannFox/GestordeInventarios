import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockClosedIcon, EnvelopeIcon, UserPlusIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5074/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Credenciales invalidas.");
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError("Error del servidor.");
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-blue-600 text-lg font-semibold">Iniciando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-108px)] flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white shadow-2xl rounded-2xl flex w-full max-w-4xl overflow-hidden animate-fade-in">
        {/* Imagen o lado visual */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white w-1/2 p-8">
          <img src="/inventario.png" alt="Logo" className="mb-6 w-32 h-auto drop-shadow-lg animate-fade-in" />
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <LockClosedIcon className="h-7 w-7 text-white" />
            Bienvenido
          </h2>
          <p className="text-center text-lg">Ingresa a tu cuenta para acceder al sistema</p>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6 flex items-center gap-2 justify-center">
            <ArrowRightCircleIcon className="h-7 w-7" />
            Iniciar Sesión
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                <LockClosedIcon className="h-5 w-5 text-blue-500" />
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <LockClosedIcon className="h-5 w-5" />
              Iniciar sesión
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              ¿No tienes una cuenta?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-semibold flex items-center gap-1 justify-center transition-all duration-200"
              >
                <UserPlusIcon className="h-5 w-5" />
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Animación fade-in */}
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

export default Login;
