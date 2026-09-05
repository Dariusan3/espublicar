"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useProducts from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { EmptyState, SkeletonGrid } from "@/components/common/Skeleton";
import { formatPrice } from "@/helpers/common";
import { useConfirm } from "@/components/common/ConfirmDialog";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop";

function ListingImage({ src, alt }: { src?: string; alt: string }) {
  const initial = src && src.trim().length > 0 ? src : FALLBACK_IMG;
  const [current, setCurrent] = useState(initial);
  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, 33vw"
      className="my-listing-img"
      onError={() => setCurrent(FALLBACK_IMG)}
      unoptimized
    />
  );
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  return `hace ${Math.floor(days / 30)}mes`;
}

export default function MyAccountListings() {
  const { user } = useAuth();
  const { products, getMyProducts, isLoading, deleteProduct, updateProduct } =
    useProducts();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const confirm = useConfirm();

  useEffect(() => {
    if (user) getMyProducts(user.$id);
  }, [user, getMyProducts]);

  useEffect(() => {
    // React (App Router) also listens on `document`, so stopPropagation inside
    // the menu cannot keep this handler from firing on the same click that
    // opens it. Ignore clicks that land inside a menu instead.
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.(".my-listing-menu")) return;
      setOpenMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDelete = async (id: string | number, title: string) => {
    const ok = await confirm({
      title: `¿Eliminar "${title}"?`,
      description:
        "El anuncio desaparece de la tienda y no se puede recuperar. Si solo quieres dejar de venderlo por ahora, púsalo en pausa.",
      confirmLabel: "Eliminar anuncio",
      cancelLabel: "Volver",
      tone: "danger",
    });
    if (!ok) return;
    const result = await deleteProduct(id.toString());
    if (result.success) {
      toast.success("Anuncio eliminado");
    } else {
      toast.error("Error al eliminar");
    }
  };

  const handleStatusChange = async (
    id: string | number,
    newStatus: "active" | "paused" | "sold",
  ) => {
    const result = await updateProduct(String(id), { status: newStatus });
    if (result.success) {
      const labels = {
        active: "Anuncio activado",
        paused: "Anuncio pausado",
        sold: "Marcado como vendido",
      };
      toast.success(labels[newStatus]);
      if (user) getMyProducts(user.$id);
    } else {
      toast.error("Error al actualizar el anuncio");
    }
  };

  if (!user) {
    return (
      <div className="section-products-empty">
        <p>Inicia sesión para ver tus anuncios.</p>
        <a href="#log" data-bs-toggle="modal" className="btn-brand">
          Iniciar sesión
        </a>
      </div>
    );
  }

  return (
    <div className="my-listings-v2">
      <header className="section-head">
        <div>
          <h2>Mis anuncios</h2>
          {products.length > 0 && (
            <p className="section-head-sub">
              <span>
                {products.length}{" "}
                {products.length === 1 ? "anuncio publicado" : "anuncios publicados"}
              </span>
            </p>
          )}
        </div>
        <Link href="/add-product" className="btn-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Publicar anuncio
        </Link>
      </header>

      {isLoading ? (
        <SkeletonGrid count={3} />
      ) : products.length === 0 ? (
        <EmptyState
          illustration="tag"
          title="Aún no has publicado ningún anuncio"
          description="Empieza vendiendo lo que ya no usas. Publicar es gratis y lleva menos de un minuto."
          action={{
            label: "Publicar mi primer anuncio →",
            href: "/add-product",
          }}
        />
      ) : (
        <div className="my-listings-grid">
          {products.map((item) => {
            const idStr = String(item.id);
            const isOpen = openMenuId === idStr;
            return (
              <div key={idStr} className="my-listing-card">
                <Link
                  href={`/product/${item.id}`}
                  className="my-listing-image"
                >
                  <ListingImage
                    src={item.imgSrc}
                    alt={item.title}
                  />
                  {(() => {
                    const status = item.status || "active";
                    const cfg: Record<string, { cls: string; label: string }> =
                      {
                        active: { cls: "chip-success", label: "Activo" },
                        paused: { cls: "chip-warn", label: "Pausado" },
                        sold: { cls: "", label: "Vendido" },
                      };
                    const { cls, label } = cfg[status] || cfg.active;
                    return (
                      <span className={`chip ${cls} my-listing-status`}>
                        {label}
                      </span>
                    );
                  })()}
                </Link>

                <div className="my-listing-body">
                  <div className="my-listing-row">
                    <Link
                      href={`/product/${item.id}`}
                      className="my-listing-title"
                    >
                      {item.title}
                    </Link>
                    <div
                      className="my-listing-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="my-listing-menu-btn"
                        onClick={() => setOpenMenuId(isOpen ? null : idStr)}
                        aria-label="Acciones"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="5" cy="12" r="1.8" />
                          <circle cx="12" cy="12" r="1.8" />
                          <circle cx="19" cy="12" r="1.8" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="my-listing-menu-panel glass">
                          <Link
                            href={`/product/${item.id}`}
                            className="my-listing-menu-item"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Ver anuncio
                          </Link>
                          <Link
                            href={`/add-product?edit=${item.id}`}
                            className="my-listing-menu-item"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Editar
                          </Link>
                          {item.status !== "sold" &&
                            (item.status === "paused" ? (
                              <button
                                type="button"
                                className="my-listing-menu-item"
                                onClick={() =>
                                  handleStatusChange(item.id, "active")
                                }
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Activar
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="my-listing-menu-item"
                                onClick={() =>
                                  handleStatusChange(item.id, "paused")
                                }
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="6" y="4" width="4" height="16" />
                                  <rect x="14" y="4" width="4" height="16" />
                                </svg>
                                Pausar
                              </button>
                            ))}
                          {item.status !== "sold" && (
                            <button
                              type="button"
                              className="my-listing-menu-item"
                              onClick={() =>
                                handleStatusChange(item.id, "sold")
                              }
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Marcar como vendido
                            </button>
                          )}
                          <div className="my-listing-menu-divider" />
                          <button
                            type="button"
                            className="my-listing-menu-item my-listing-menu-item-danger"
                            onClick={() =>
                              handleDelete(item.id, item.title)
                            }
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-listing-price num">
                    {formatPrice(item.price)}
                  </div>

                  <div className="my-listing-meta">
                    {item.location && (
                      <span className="my-listing-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {item.location}
                      </span>
                    )}
                    {item.createdAt && (
                      <span className="my-listing-meta-item">
                        {timeAgo(item.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
