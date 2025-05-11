import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerProducto = () => {
  const { idProducto } = useParams(); // Obtener el ID del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:5074/api/Products/${idProducto}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el producto");
        }

        const productoData = await response.json();

        // Asignar el nombre de la categoría al producto
        const categoriaResponse = await fetch("http://localhost:5074/api/Categoria", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!categoriaResponse.ok) {
          throw new Error("Error al obtener las categorías");
        }

        const categoriasData = await categoriaResponse.json();
        const categoria = categoriasData.find(
          (cat) => cat.id_categoria === productoData.idCategoria
        );
        productoData.nombreCategoria = categoria ? categoria.nombre : "Sin categoría";

        setProducto(productoData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el producto o las categorías:", error);
        setLoading(false);
      }
    };

    fetchProducto();
  }, [idProducto]);

  const handleBack = () => {
    navigate("/productos"); // Redirige a la lista de productos
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando producto...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
        Detalles del Producto
      </h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          <strong>Nombre:</strong> {producto.nombre}
        </p>
        <p className="mb-4">
          <strong>Descripción:</strong> {producto.descripcion}
        </p>
        <p className="mb-4">
          <strong>Categoría:</strong> {producto.nombreCategoria || "Sin categoría"}
        </p>
        <p className="mb-4">
          <strong>Stock:</strong> {producto.stock}
        </p>
        <p className="mb-4">
          <strong>Precio Unitario:</strong>{" "}
          {producto.precioUnitario.toLocaleString("es-EC", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerProducto;