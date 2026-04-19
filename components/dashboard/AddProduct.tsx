"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadProductImage, getProductImageUrl } from "@/lib/storage";
import Image from "next/image";

const MAX_IMAGES = 8;

export default function AddProduct() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    condition: "Como nuevo",
    location: "",
    isNegotiable: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addFiles = (files: File[]) => {
    const remaining = MAX_IMAGES - imageFiles.length;
    if (remaining <= 0) {
      toast.warning(`Máximo ${MAX_IMAGES} imágenes permitidas`);
      return;
    }

    const validFiles = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);

    if (validFiles.length < files.length) {
      toast.warning(
        `Solo se pueden añadir ${remaining} imagen(es) más`,
      );
    }

    // Generate previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Por favor, inicia sesión para vender artículos");
      return;
    }

    setIsLoading(true);
    try {
      let allImageUrls: string[] = [];

      // Upload files if present
      if (imageFiles.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);
        try {
          const urls: string[] = [];
          for (let i = 0; i < imageFiles.length; i++) {
            const uploadResult = await uploadProductImage(imageFiles[i]);
            urls.push(getProductImageUrl(uploadResult.$id));
            setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
          }
          allImageUrls = urls;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(
            "Error al subir las imágenes. Por favor, inténtalo de nuevo.",
          );
          setIsLoading(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      } else if (externalUrl.trim()) {
        allImageUrls = [externalUrl.trim()];
      }

      const mainImage =
        allImageUrls[0] ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop";

      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        imgSrc: mainImage,
        imgHover: allImageUrls[1] || "",
        thumbImages: allImageUrls.length > 0 ? allImageUrls : [],
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

        {/* Multi-Image Upload Section */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-uppercase ls-1">
            Fotos del Producto
            <span className="text-muted fw-normal ms-2">
              ({imageFiles.length}/{MAX_IMAGES})
            </span>
          </label>

          {/* Image Preview Grid */}
          {imagePreviews.length > 0 && (
            <div className="d-flex flex-wrap gap-3 mb-3">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="position-relative rounded-3 overflow-hidden shadow-sm"
                  style={{ width: "120px", height: "120px" }}
                >
                  <Image
                    src={preview}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-fit-cover"
                  />
                  {index === 0 && (
                    <span
                      className="position-absolute top-0 start-0 badge bg-primary m-1"
                      style={{ fontSize: "0.65rem" }}
                    >
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-0 d-flex align-items-center justify-content-center"
                    onClick={() => removeImage(index)}
                    style={{ width: "24px", height: "24px", fontSize: "0.7rem" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          {imageFiles.length < MAX_IMAGES && (
            <div
              className="upload-box p-4 border-2 border-dashed border-light rounded-4 text-center hover-bg-light transition-all cursor-pointer position-relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="position-absolute w-100 h-100 top-0 start-0 opacity-0 cursor-pointer"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ zIndex: 2 }}
              />
              <div className="py-2">
                <i className="icon-upload-cloud fs-1 text-primary mb-2 d-block"></i>
                <span className="fw-medium text-dark d-block">
                  Seleccionar fotos o arrastrar aquí
                </span>
                <span className="small text-muted">
                  JPG, PNG, WebP — Máx. {MAX_IMAGES} fotos, 5MB cada una
                </span>
              </div>
            </div>
          )}

          {/* External URL fallback */}
          {imageFiles.length === 0 && (
            <div className="mt-2 text-center">
              <span className="text-muted small">O usa una URL externa:</span>
              <input
                type="text"
                className="form-control rounded-3 p-3 border-light shadow-sm mt-2"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-3">
              <div className="progress rounded-pill" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <small className="text-muted mt-1 d-block text-center">
                Subiendo imágenes... {uploadProgress}%
              </small>
            </div>
          )}
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
            <strong>Consejo:</strong> Sube varias fotos de buena calidad desde
            diferentes ángulos y sé honesto con el estado del producto para
            vender más rápido y evitar devoluciones.
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
          {isLoading
            ? isUploading
              ? `Subiendo imágenes... ${uploadProgress}%`
              : "Publicando..."
            : "Publicar Anuncio Ahora"}
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
        .border-dashed {
          border-style: dashed !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
