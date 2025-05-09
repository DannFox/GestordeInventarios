import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Footer from "./Footer";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Register from "./pages/Register";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import GestionRoles from "./pages/admin/GestionRoles";
import GestionCategorias from "./pages/admin/GestionCategorias";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Aquí van las rutas de la aplicación */}
        <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Ruta privada para el dashboard */}
          <Route 
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          />
          {/* Rutas de administración */}
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute>
                <GestionUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute>
                <GestionRoles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <ProtectedRoute>
                <GestionCategorias />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Pie de página visible en todas las rutas */}
        <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
