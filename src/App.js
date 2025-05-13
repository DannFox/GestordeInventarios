import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Footer from "./Footer";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Register from "./pages/Register";
import Productos from "./pages/Productos";
import NuevoProducto from "./pages/NuevoProducto";
import EditarProducto from "./pages/EditarProducto";
import VerProducto from "./pages/VerProducto";
import Categoria from "./pages/Categoria";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import GestionRoles from "./pages/admin/GestionRoles";
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
          <Route
          path="/productos"
          element={
            <PrivateRoute>
              <Productos />
            </PrivateRoute>
          }
          />
          <Route
          path="/productos/nuevo"
          element={
            <PrivateRoute>
              <NuevoProducto />
            </PrivateRoute>
          }
          />
          <Route
          path="/productos/editar/:idProducto"
          element={
            <PrivateRoute>
              <EditarProducto />
            </PrivateRoute>
          }
          />
          <Route
          path="/productos/:idProducto"
          element={
            <PrivateRoute>
              <VerProducto />
            </PrivateRoute>
          }
          />
          <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <Categoria />
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
        </Routes>

        {/* Pie de página visible en todas las rutas */}
        <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
