import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftCircleIcon,
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const VerProducto = () => {
  const { idProducto } = useParams();
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
    navigate("/productos");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold">Cargando producto...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 p-4 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-green-700 hover:text-green-900 transition-all duration-200"
        >
          <ArrowLeftCircleIcon className="h-6 w-6" />
          Volver a Productos
        </button>
        <div className="bg-white p-8 rounded-2xl shadow-2xl animate-fade-in">
          <h1 className="text-2xl font-bold text-center text-green-600 mb-8 flex items-center gap-2 justify-center">
            <CubeIcon className="h-7 w-7" />
            Detalles del Producto
          </h1>
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-lg">
              <TagIcon className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Nombre:</span>
              <span>{producto.nombre}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Descripción:</span>
              <span>{producto.descripcion}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Categoría:</span>
              <span>{producto.nombreCategoria || "Sin categoría"}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <ArchiveBoxIcon className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Stock:</span>
              <span>{producto.stock}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Precio Unitario:</span>
              <span>
                {producto.precioUnitario.toLocaleString("es-EC", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default VerProducto;