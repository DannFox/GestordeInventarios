import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Verifica si el token ha expirado
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token"); // Limpia el token caducado
      return <Navigate to="/login" />;
    }

    const userRole =
      decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (userRole !== "Admin") {
      return <Navigate to="/dashboard" />;
    }
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    localStorage.removeItem("token"); // Limpia el token inválido
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;