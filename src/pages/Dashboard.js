import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { CubeIcon, ArchiveBoxIcon, CurrencyDollarIcon, HomeIcon, ClipboardDocumentListIcon, Squares2X2Icon, UserCircleIcon, ArrowRightOnRectangleIcon, WrenchScrewdriverIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef(null);

  // Mensaje del día
  const [mensajeDelDia, setMensajeDelDia] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin");
      } catch (error) {}
    }

    // Obtener productos y categorías
    const fetchProductosYCategorias = async () => {
      try {
        const [productosResponse, categoriasResponse] = await Promise.all([
          fetch("http://localhost:5074/api/Products", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5074/api/Categoria", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!productosResponse.ok || !categoriasResponse.ok) {
          throw new Error("Error al obtener productos o categorías");
        }

        const productosData = await productosResponse.json();
        const categoriasData = await categoriasResponse.json();

        // Mapear idCategoria a nombreCategoria en los productos
        const productosConNombreCategoria = productosData.map((producto) => {
          const categoria = categoriasData.find((cat) => cat.id_categoria === producto.idCategoria);
          return {
            ...producto,
            nombreCategoria: categoria ? categoria.nombre : "Sin categoría",
          };
        });

        setProductos(productosConNombreCategoria);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProductosYCategorias();

    // Generar mensaje del día
    const mensajes = [
      "¡Hoy es un gran día para organizar tu inventario!",
      "Recuerda revisar los productos con bajo stock.",
      "¡Mantén tus categorías actualizadas para un mejor control!",
      "Un inventario organizado es clave para el éxito.",
      "¡Sigue trabajando duro, estás haciendo un gran trabajo!",
    ];
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
    setMensajeDelDia(mensajeAleatorio);
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

  // Exportar a Excel
  const exportarExcel = () => {
    const datos = productos.map((p) => ({
      Nombre: p.nombre,
      Descripción: p.descripcion,
      Categoría: p.nombreCategoria,
      Stock: p.stock,
      "Precio Unitario": p.precioUnitario,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "productos.xlsx");
  };

  // Exportar a PDF
  const exportarPDF = async () => {
    const doc = new jsPDF();
    doc.text("Listado de Productos", 14, 16);
    const tableColumn = ["Nombre", "Descripción", "Categoría", "Stock", "Precio Unitario"];
    const tableRows = [];

    for (const p of productos) {
      tableRows.push([
        p.nombre,
        p.descripcion,
        p.nombreCategoria,
        p.stock,
        p.precioUnitario,
      ]);
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 10 },
    });
    doc.save("productos.pdf");
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
  const totalPrecio = productos.reduce((sum, producto) => sum + producto.precioUnitario * producto.stock, 0);

  // Calcular datos para el gráfico de pastel
  const categoriasUnicas = [...new Set(productos.map((producto) => producto.nombreCategoria))];
  const categoriasData = categoriasUnicas.map((categoria) => {
    const totalPorCategoria = productos
      .filter((producto) => producto.nombreCategoria === categoria)
      .reduce((sum, producto) => sum + producto.stock, 0);
    return totalPorCategoria;
  });

  const pieChartData = {
    labels: categoriasUnicas,
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
          <h1 className="text-lg font-bold flex items-center gap-2">
            <HomeIcon className="h-6 w-6 inline-block" />
            Gestor de Inventario
          </h1>
          <nav>
            <ul className="flex space-x-4 relative items-center">
              <li>
                <Link to="/dashboard" className="hover:underline flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95">
                  <HomeIcon className="h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/productos" className="hover:underline flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95">
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="hover:underline flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95">
                  <Squares2X2Icon className="h-5 w-5" />
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  to="/productos/agregar"
                  className="hover:underline flex items-center gap-1 bg-blue-500 px-3 py-1 rounded text-white transition-all duration-200 hover:bg-blue-600 hover:scale-105 hover:shadow-lg active:scale-95"
                  title="Agregar Producto"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Agregar Producto
                </Link>
              </li>
              {isAdmin && (
                <li className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className="hover:underline flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95"
                  >
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                    Administración
                  </button>
                  {showAdminMenu && (
                    <ul className="absolute bg-white text-black shadow-md rounded-lg mt-2 p-2 space-y-2">
                      <li>
                        <Link to="/admin/usuarios" className="hover:underline block px-4 py-2 flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95">
                          <UserCircleIcon className="h-5 w-5" />
                          Gestión de Usuarios
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/roles" className="hover:underline block px-4 py-2 flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95">
                          <WrenchScrewdriverIcon className="h-5 w-5" />
                          Gestión de Roles
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="hover:underline flex items-center gap-1 transition-all duration-200 hover:scale-105 hover:text-blue-200 active:scale-95">
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
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

        {/* Mensaje del día */}
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md mb-6 text-center">
          <p className="text-lg font-semibold">{mensajeDelDia}</p>
        </div>

        {/* Botones de exportación */}
        <div className="flex gap-4 justify-end mb-4">
          <button
            onClick={exportarExcel}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Exportar a Excel
          </button>
          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Exportar a PDF
          </button>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center">
            <CubeIcon className="h-8 w-8 text-green-500 mb-2" />
            <h2 className="text-xl font-bold text-green-600">{totalProductos}</h2>
            <p className="text-gray-600 text-sm">Productos en total</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center">
            <ArchiveBoxIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h2 className="text-xl font-bold text-green-600">{totalStock}</h2>
            <p className="text-gray-600 text-sm">Stock total</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500 mb-2" />
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