"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadProductImage, getProductImageUrl } from "@/lib/storage";
import Image from "next/image";

const MAX_IMAGES = 12;
const MAX_DESC_CHARS = 1000;

const CATEGORIES = [
  "Electrónica",
  "Moda",
  "Hogar",
  "Deportes",
  "Vehículos",
  "Muebles",
  "Libros",
  "Coleccionismo",
  "Otros",
];

const CONDITIONS = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Como nuevo", label: "Como nuevo" },
  { value: "Muy bueno", label: "Muy bueno" },
  { value: "Bueno", label: "Bueno" },
  { value: "Aceptable", label: "Aceptable" },
];

const DELIVERY_OPTIONS = [
  { value: "shipping", label: "Envío con espublicar" },
  { value: "pickup", label: "Recogida en mano" },
  { value: "both", label: "Ambas" },
];

export default function AddProduct() {
  const { user } = useAuth();
  const { addProduct, updateProduct, getProductById } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragover, setIsDragover] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    location: "",
    isNegotiable: false,
    delivery: "both",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Load existing product data in edit mode
  useEffect(() => {
    if (!editId) return;
    const load = async () => {
      const res = await getProductById(editId);
      if (res.success && res.data) {
        const p = res.data;
        setFormData({
          title: p.title || "",
          price: String(p.price ?? ""),
          category: p.category || "",
          condition: p.condition || "",
          description: p.description || "",
          location: p.location || "",
          isNegotiable: p.isNegotiable || false,
          delivery: "both",
        });
        const imgs = p.thumbImages && p.thumbImages.length > 0
          ? p.thumbImages
          : p.imgSrc ? [p.imgSrc] : [];
        setExistingImages(imgs);
        setImagePreviews(imgs);
      } else {
        toast.error("No se pudo cargar el anuncio");
        router.push("/mi-cuenta/anuncios");
      }
      setLoadingProduct(false);
    };
    load();
  }, [editId, getProductById, router]);

  // Progress calculation (3 steps)
  const step1Done = imageFiles.length > 0 || existingImages.length > 0;
  const step2Done = !!(formData.title && formData.category && formData.condition && formData.price);
  const step3Done = !!formData.location;
  const steps = [step1Done, step2Done, step3Done];

  const canPublish = step1Done && step2Done && step3Done;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const addFiles = (files: File[]) => {
    const remaining = MAX_IMAGES - imageFiles.length;
    if (remaining <= 0) {
      toast.warning(`Máximo ${MAX_IMAGES} fotos`);
      return;
    }

    const validFiles = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);

    if (validFiles.length < files.length) {
      toast.warning(`Solo se pueden añadir ${remaining} foto(s) más`);
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    // Index might point into the existingImages portion of imagePreviews
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - existingImages.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const moveCover = (index: number) => {
    if (index === 0) return;
    setImageFiles((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
    setImagePreviews((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragover(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragover(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragover(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Inicia sesión para publicar");
      return;
    }
    if (!canPublish) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    setIsLoading(true);
    try {
      let newImageUrls: string[] = [];

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
          newImageUrls = urls;
        } catch (uploadError: any) {
          const msg =
            uploadError?.message ||
            uploadError?.response?.message ||
            "Error desconocido";
          console.error("Upload error:", uploadError);
          toast.error(`Error al subir las fotos: ${msg}`);
          setIsLoading(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Combine existing (kept) + newly uploaded images
      const allImageUrls = [...existingImages, ...newImageUrls];

      const productData: any = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        imgSrc: allImageUrls[0],
        imgHover: allImageUrls[1] || "",
        thumbImages: allImageUrls,
        condition: formData.condition,
        location: formData.location,
        isNegotiable: formData.isNegotiable,
      };

      let result;
      if (isEditMode && editId) {
        result = await updateProduct(editId, productData);
      } else {
        result = await addProduct({
          ...productData,
          userId: user.$id,
          rating: 0,
          sold: 0,
          available: 1,
          inStock: true,
          status: "active",
        });
      }

      if (result.success) {
        toast.success(isEditMode ? "¡Anuncio actualizado!" : "¡Anuncio publicado!");
        router.push("/mi-cuenta/anuncios");
      } else {
        toast.error(result.message || "Error al publicar");
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="publicar-v2" style={{ textAlign: "center", padding: "80px 0" }}>
        <div className="spinner-border text-primary" role="status" />
        <p className="text-ink-3 mt-3">Cargando anuncio…</p>
      </div>
    );
  }

  return (
    <div className="publicar-v2">
      {/* Header */}
      <div className="publicar-v2-header">
        <div>
          <h1 className="publicar-v2-title">
            {isEditMode ? "Editar anuncio" : "Publica tu anuncio"}
          </h1>
          <p className="publicar-v2-subtitle">
            {isEditMode
              ? "Actualiza los detalles de tu anuncio."
              : "Lleva menos de un minuto. Es gratis."}
          </p>
        </div>
        <div className="publicar-v2-progress" aria-label="Progreso">
          {steps.map((done, i) => (
            <span
              key={i}
              className={`publicar-v2-dot ${done ? "is-active" : ""}`}
              aria-label={`Paso ${i + 1}${done ? " completado" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Fotos */}
      <section className="publicar-v2-section">
        <h2 className="publicar-v2-section-title">
          <span className="publicar-v2-step-num">1</span> Fotos
        </h2>

        {imageFiles.length < MAX_IMAGES && (
          <div
            className={`dropzone ${isDragover ? "is-dragover" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="dropzone-input"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
            <svg className="dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <p className="dropzone-title">Arrastra hasta {MAX_IMAGES} fotos</p>
            <p className="dropzone-sub">o haz clic para seleccionar</p>
            <button type="button" className="btn-ghost btn-sm dropzone-btn">
              Elegir fotos
            </button>
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="publicar-v2-thumbs">
            {imagePreviews.map((src, i) => (
              <div key={i} className="publicar-v2-thumb">
                <Image
                  src={src}
                  alt={`Foto ${i + 1}`}
                  fill
                  className="publicar-v2-thumb-img"
                />
                {i === 0 && (
                  <span className="publicar-v2-thumb-cover">Portada</span>
                )}
                <button
                  type="button"
                  className="publicar-v2-thumb-remove"
                  onClick={() => removeImage(i)}
                  aria-label="Eliminar"
                >
                  ✕
                </button>
                {i !== 0 && (
                  <button
                    type="button"
                    className="publicar-v2-thumb-cover-set"
                    onClick={() => moveCover(i)}
                  >
                    Hacer portada
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Step 2: Detalles */}
      <section className="publicar-v2-section">
        <h2 className="publicar-v2-section-title">
          <span className="publicar-v2-step-num">2</span> Detalles
        </h2>

        <div className="stack-5">
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Título</label>
            <input
              type="text"
              name="title"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: iPhone 13 Pro 256GB"
              maxLength={80}
            />
          </div>

          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Categoría</label>
            <select
              name="category"
              className="input-field"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Estado</label>
            <div className="publicar-v2-chip-group">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`chip ${formData.condition === c.value ? "is-active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, condition: c.value }))
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Precio</label>
            <div className="publicar-v2-price-row">
              <div className="publicar-v2-price-input">
                <span className="publicar-v2-price-prefix">€</span>
                <input
                  type="number"
                  name="price"
                  className="input-field"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <label className="publicar-v2-check">
                <input
                  type="checkbox"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleChange}
                />
                <span>Negociable</span>
              </label>
            </div>
          </div>

          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Descripción</label>
            <textarea
              name="description"
              className="input-field"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el estado, accesorios incluidos, motivo de venta…"
              maxLength={MAX_DESC_CHARS}
            />
            <div className="publicar-v2-char-count">
              {formData.description.length} / {MAX_DESC_CHARS}
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Envío y ubicación */}
      <section className="publicar-v2-section">
        <h2 className="publicar-v2-section-title">
          <span className="publicar-v2-step-num">3</span> Envío y ubicación
        </h2>

        <div className="stack-5">
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Ubicación</label>
            <input
              type="text"
              name="location"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              placeholder="Madrid, España"
            />
            <p className="publicar-v2-hint">
              Solo mostraremos tu ciudad, no tu dirección exacta.
            </p>
          </div>

          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Entrega</label>
            <div className="publicar-v2-chip-group">
              {DELIVERY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`chip ${formData.delivery === o.value ? "is-active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, delivery: o.value }))
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upload progress */}
      {isUploading && (
        <div className="publicar-v2-progress-bar">
          <div className="publicar-v2-progress-track">
            <div
              className="publicar-v2-progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span>Subiendo fotos… {uploadProgress}%</span>
        </div>
      )}

      {/* Sticky footer */}
      <div className="publicar-v2-sticky-footer glass">
        <button type="button" className="btn-ghost" disabled>
          Guardar borrador
        </button>
        <button
          type="button"
          className="btn-brand btn-lg"
          onClick={handleSubmit}
          disabled={!canPublish || isLoading}
        >
          {isLoading
            ? isEditMode
              ? "Guardando…"
              : "Publicando…"
            : isEditMode
              ? "Guardar cambios"
              : "Publicar →"}
        </button>
      </div>
    </div>
  );
}
