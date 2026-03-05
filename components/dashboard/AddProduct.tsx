"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProduct() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    imgSrc: "",
    condition: "Como nuevo",
    location: "",
    isNegotiable: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Por favor, inicia sesión para vender artículos");
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        imgSrc:
          formData.imgSrc ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
        userId: user.$id,
        rating: 0,
        sold: 0,
        available: 1,
        inStock: true,
        condition: formData.condition,
        location: formData.location,
        isNegotiable: formData.isNegotiable,
      };

      const result = await addProduct(productData);
      if (result.success) {
        toast.success("¡Anuncio publicado correctamente!");
        router.push("/my-account-listings");
      } else {
        toast.error(result.message || "Error al publicar el anuncio");
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="add-product-container p-4 rounded-4"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3 border-light">
        <h4 className="fw-bold mb-0 text-dark">
          <i className="icon-plus-circle me-2 text-primary"></i>
          Vender un Artículo
        </h4>
        <Link
          href="/my-account-listings"
          className="btn btn-sm btn-outline-secondary rounded-pill"
        >
          Ver mis anuncios
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-add-product">
        <div className="mb-4">
          <label className="form-label fw-bold small text-uppercase ls-1">
            Título del anuncio
          </label>
          <input
            type="text"
            className="form-control rounded-3 p-3 border-light shadow-sm"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ej: iPhone 13 Pro Max como nuevo"
            style={{ fontSize: "1rem" }}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label fw-bold small text-uppercase ls-1">
              Precio (€)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-light rounded-start-3">
                €
              </span>
              <input
                type="number"
                className="form-control rounded-end-3 p-3 border-light shadow-sm"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label fw-bold small text-uppercase ls-1">
              Categoría
            </label>
            <select
              className="form-select rounded-3 p-3 border-light shadow-sm"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona Categoría</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Moda">Moda</option>
              <option value="Hogar">Hogar</option>
              <option value="Deportes">Deportes</option>
              <option value="Vehículos">Vehículos</option>
              <option value="Muebles">Muebles</option>
              <option value="Libros">Libros</option>
              <option value="Coleccionismo">Coleccionismo</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <label className="form-label fw-bold small text-uppercase ls-1">
              Estado del Producto
            </label>
            <select
              className="form-select rounded-3 p-3 border-light shadow-sm"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="Nuevo">Reluciente (Nuevo)</option>
              <option value="Como nuevo">Como nuevo</option>
              <option value="Muy bueno">Muy bueno</option>
              <option value="Bueno">Bueno (Usado)</option>
              <option value="Aceptable">Aceptable (Con marcas)</option>
            </select>
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label fw-bold small text-uppercase ls-1">
              Ubicación (Ciudad)
            </label>
            <input
              type="text"
              className="form-control rounded-3 p-3 border-light shadow-sm"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Ej: Madrid, Valencia..."
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="form-check form-switch p-3 bg-light rounded-3 border-light">
            <input
              className="form-check-input ms-0"
              type="checkbox"
              id="isNegotiable"
              name="isNegotiable"
              checked={formData.isNegotiable}
              onChange={handleChange}
            />
            <label
              className="form-check-label ms-2 fw-medium"
              htmlFor="isNegotiable"
            >
              ¿Precio negociable? (Aceptar ofertas)
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold small text-uppercase ls-1">
            URL de la Imagen
          </label>
          <input
            type="text"
            className="form-control rounded-3 p-3 border-light shadow-sm"
            name="imgSrc"
            value={formData.imgSrc}
            onChange={handleChange}
            placeholder="https://ejemplo.com/foto.jpg"
          />
          <div className="form-text small text-muted mt-2">
            <i className="icon-info me-1"></i>
            Por ahora, usa un link externo. La subida directa de fotos estará
            pronto disponible.
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold small text-uppercase ls-1">
            Descripción Detallada
          </label>
          <textarea
            className="form-control rounded-3 p-3 border-light shadow-sm"
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe el estado, por qué lo vendes, accesorios incluidos..."
          ></textarea>
        </div>

        <div className="alert alert-warning border-0 rounded-3 small p-3 mb-4 d-flex gap-3">
          <i className="icon-alert-triangle fs-4 text-warning"></i>
          <div>
            <strong>Consejo:</strong> Sube fotos de buena calidad y sé honesto
            con el estado del producto para vender más rápido y evitar
            devoluciones.
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-lg transition-all hover-up"
          disabled={isLoading}
          style={{ transition: "all 0.3s ease" }}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : (
            <i className="icon-check-circle me-2"></i>
          )}
          {isLoading ? "Publicando..." : "Publicar Anuncio Ahora"}
        </button>
      </form>

      <style jsx>{`
        .ls-1 {
          letter-spacing: 0.5px;
        }
        .hover-up:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .form-control:focus,
        .form-select:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1) !important;
        }
      `}</style>
    </div>
  );
}
