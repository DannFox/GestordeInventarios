import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [showAdminMenu, setShowAdminMenu] = useState(false); 
  const adminMenuRef = useRef(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); 
        setIsAdmin(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin");
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }

    fetch("http://localhost:5074/api/Products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No autorizado o error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <h1 className="text-3xl font-bold">Cargando productos...</h1>
      </div>
    );
  }

  // Calcular estadísticas
  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, producto) => sum + producto.stock, 0);
  const totalPrecio = productos.reduce((sum, producto) => sum + producto.precioUnitario * producto.stock, 0); // Precio total
  const categorias = [...new Set(productos.map((producto) => producto.nombreCategoria))];

  // Datos para el gráfico de pastel
  const categoriasData = categorias.map((categoria) => {
    const totalPorCategoria = productos
      .filter((producto) => producto.nombreCategoria === categoria)
      .reduce((sum, producto) => sum + producto.stock, 0);
    return totalPorCategoria;
  });

  const pieChartData = {
    labels: categorias,
    datasets: [
      {
        data: categoriasData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="min-h-[calc(100vh-108px)] bg-gray-100">
      {/* Encabezado */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Gestor de Inventario</h1>
          <nav>
            <ul className="flex space-x-4 relative">
              <li>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/productos" className="hover:underline">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="hover:underline">
                  Categorías
                </Link>
              </li>
              {isAdmin && (
                <li className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className="hover:underline"
                  >
                    Administración
                  </button>
                  {showAdminMenu && (
                    <ul className="absolute bg-white text-black shadow-md rounded-lg mt-2 p-2 space-y-2">
                      <li>
                        <Link to="/admin/usuarios" className="hover:underline block px-4 py-2">
                          Gestión de Usuarios
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/roles" className="hover:underline block px-4 py-2">
                          Gestión de Roles
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/categorias" className="hover:underline block px-4 py-2">
                          Gestión de Categorías
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Resumen del Inventario</h1>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-bold text-green-600">{totalProductos}</h2>
            <p className="text-gray-600 text-sm">Productos en total</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-bold text-green-600">{totalStock}</h2>
            <p className="text-gray-600 text-sm">Stock total</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-xl font-bold text-green-600">
              {totalPrecio.toLocaleString("es-EC", {
                style: "currency",
                currency: "USD",
              })}
            </h2>
            <p className="text-gray-600 text-sm">Precio total</p>
          </div>
        </div>

        {/* Gráfico de pastel */}
        <div className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-center mb-4">Stock por Categoría</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;