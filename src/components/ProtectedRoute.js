import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (userRole !== "Admin") {
      // Si el rol no es Admin, redirige al dashboard
      return <Navigate to="/dashboard" />;
    }
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <Navigate to="/login" />;
  }

  // Si el usuario tiene el rol adecuado, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;