import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Footer from "./Footer";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Aquí van las rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          />
          {/* Puedes agregar más rutas aquí */}
        </Routes>

        {/* Pie de página visible en todas las rutas */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
