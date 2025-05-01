import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage

    fetch("http://localhost:5074/api/Products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <h1 className="text-3xl font-bold">Cargando productos...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100">
      {/* Encabezado del menú */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestor de Inventario</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/dashboard" className="hover:underline">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/productos" className="hover:underline">
                  Productos
                </a>
              </li>
              <li>
                <a href="/categorias" className="hover:underline">
                  Categorías
                </a>
              </li>
              <li>
                <a href="/logout" className="hover:underline">
                  Cerrar Sesión
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Inventario</h1>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-green-200">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Precio Unitario</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Fecha Creacion</th>
              <th className="px-4 py-2">Categoria</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="text-center border-b">
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">{producto.descripcion}</td>
                <td className="px-4 py-2">
                  {typeof producto.precioUnitario === "number"
                    ? producto.precioUnitario.toLocaleString("es-EC", {
                        style: "currency",
                        currency: "USD",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-2">{producto.stock}</td>
                <td className="px-4 py-2">
                  {new Date(producto.fechaCreacion).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{producto.nombreCategoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;