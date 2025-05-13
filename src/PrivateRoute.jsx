import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Verifica si el token ha expirado
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token"); // Limpia el token caducado
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    localStorage.removeItem("token"); // Limpia el token inválido
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
