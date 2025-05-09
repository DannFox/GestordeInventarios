import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

    try {
      const res = await fetch("http://localhost:5074/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Credenciales invalidas.");
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError("Error del servidor.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-108px)] flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white shadow-2xl rounded-2xl flex w-full max-w-4xl overflow-hidden">
        
        {/* Imagen o lado visual */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white w-1/2 p-8">
          <img src="/inventario.png" alt="Logo" className="mb-6 w-32 h-auto" />
          <h2 className="text-3xl font-bold mb-4">Bienvenido</h2>
          <p className="text-center">Ingresa a tu cuenta para acceder al sistema</p>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
            >
              Iniciar sesión
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              ¿No tienes una cuenta?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
