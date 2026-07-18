"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import { toast } from "react-toastify";

const ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const PROJECT_ID = ENDPOINT.replace(/^https?:\/\//, "").split(".")[0];
const BUCKET_ID = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "images";

type Status = "checking" | "ok" | "broken";

export default function DebugImagesPage() {
  const { user } = useAuth();
  const { getMyProducts, deleteProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const res = await getMyProducts(user.$id);
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
        // Test each image
        res.data.forEach((p: Product) => {
          if (!p.imgSrc) {
            setStatuses((s) => ({ ...s, [String(p.id)]: "broken" }));
            return;
          }
          setStatuses((s) => ({ ...s, [String(p.id)]: "checking" }));
          const img = new Image();
          img.onload = () =>
            setStatuses((s) => ({ ...s, [String(p.id)]: "ok" }));
          img.onerror = () =>
            setStatuses((s) => ({ ...s, [String(p.id)]: "broken" }));
          img.src = p.imgSrc;
        });
      }
      setLoading(false);
    };
    load();
  }, [user, getMyProducts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Eliminado");
      setProducts((prev) => prev.filter((p) => String(p.id) !== id));
    }
  };

  const handleDeleteAllBroken = async () => {
    const broken = products.filter((p) => statuses[String(p.id)] === "broken");
    if (broken.length === 0) {
      toast.info("No hay anuncios con imágenes rotas");
      return;
    }
    if (
      !confirm(
        `¿Eliminar los ${broken.length} anuncios con imágenes rotas? Esta acción es permanente.`,
      )
    )
      return;
    for (const p of broken) {
      await deleteProduct(String(p.id));
    }
    setProducts((prev) =>
      prev.filter((p) => statuses[String(p.id)] !== "broken"),
    );
    toast.success(`${broken.length} anuncios eliminados`);
  };

  if (!user) {
    return (
      <>
        <Header1 />
        <section style={{ padding: "120px 20px", textAlign: "center" }}>
          <h2>Inicia sesión para ver el diagnóstico</h2>
        </section>
        <Footer1 />
      </>
    );
  }

  const okCount = products.filter((p) => statuses[String(p.id)] === "ok").length;
  const brokenCount = products.filter(
    (p) => statuses[String(p.id)] === "broken",
  ).length;

  return (
    <>
      <Header1 />
      <section style={{ background: "var(--surface-2)", padding: "40px 0", minHeight: "calc(100vh - 200px)" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <h1
            style={{
              font: "700 28px/1.2 Inter, sans-serif",
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            Diagnóstico de imágenes
          </h1>
          <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>
            Esta página comprueba que las imágenes guardadas en cada anuncio
            cargan correctamente desde Supabase Storage.
          </p>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <h3 style={{ margin: "0 0 12px", font: "600 16px Inter" }}>
              Configuración
            </h3>
            <div style={{ display: "grid", gap: 8, fontSize: 13, fontFamily: "monospace" }}>
              <div>
                <strong>Endpoint:</strong> {ENDPOINT}
              </div>
              <div>
                <strong>Project ID:</strong> {PROJECT_ID}
              </div>
              <div>
                <strong>Bucket ID:</strong> {BUCKET_ID}
              </div>
            </div>
          </div>

          {!loading && products.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 24,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 99,
                    background: "var(--success-bg)",
                    color: "var(--success)",
                    font: "600 13px Inter",
                  }}
                >
                  ✓ {okCount} OK
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 99,
                    background: "var(--danger-bg)",
                    color: "var(--danger)",
                    font: "600 13px Inter",
                  }}
                >
                  ✕ {brokenCount} rotas
                </span>
              </div>
              {brokenCount > 0 && (
                <button
                  className="btn-danger btn-sm"
                  onClick={handleDeleteAllBroken}
                >
                  Eliminar los {brokenCount} con imagen rota
                </button>
              )}
            </div>
          )}

          {loading ? (
            <p>Cargando…</p>
          ) : products.length === 0 ? (
            <p>No tienes anuncios.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {products.map((p) => {
                const id = String(p.id);
                const status = statuses[id] || "checking";
                return (
                  <div
                    key={id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr auto",
                      gap: 16,
                      padding: 16,
                      background: "var(--surface)",
                      border: `1px solid ${status === "broken" ? "var(--danger)" : "var(--line)"}`,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 8,
                        background: "var(--surface-3)",
                        display: "grid",
                        placeItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      {p.imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imgSrc}
                          alt={p.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ color: "var(--ink-4)", fontSize: 12 }}>
                          sin imagen
                        </span>
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, font: "600 15px Inter" }}>
                        {p.title}
                      </p>
                      <p
                        style={{
                          margin: "4px 0",
                          font: "500 14px Inter",
                          color: "var(--brand)",
                        }}
                      >
                        {p.price} €
                      </p>
                      <p
                        style={{
                          margin: 0,
                          font: "400 11px monospace",
                          color: "var(--ink-3)",
                          wordBreak: "break-all",
                          maxWidth: 600,
                        }}
                      >
                        {p.imgSrc || "(vacío)"}
                      </p>
                      <div style={{ marginTop: 6 }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 99,
                            font: "600 11px Inter",
                            background:
                              status === "ok"
                                ? "var(--success-bg)"
                                : status === "broken"
                                  ? "var(--danger-bg)"
                                  : "var(--surface-3)",
                            color:
                              status === "ok"
                                ? "var(--success)"
                                : status === "broken"
                                  ? "var(--danger)"
                                  : "var(--ink-3)",
                          }}
                        >
                          {status === "ok"
                            ? "✓ Imagen carga"
                            : status === "broken"
                              ? "✕ Imagen rota"
                              : "Comprobando…"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {p.imgSrc && (
                        <a
                          href={p.imgSrc}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost btn-sm"
                          style={{ textAlign: "center", fontSize: 12 }}
                        >
                          Abrir URL
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(id, p.title)}
                        className="btn-danger btn-sm"
                        style={{ fontSize: 12 }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: "var(--brand-50)",
              borderRadius: 12,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-2)",
            }}
          >
            <h3 style={{ margin: "0 0 12px", font: "600 15px Inter", color: "var(--ink)" }}>
              ¿Qué hacer si una imagen aparece como rota?
            </h3>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                Click <strong>Abrir URL</strong> — si el navegador muestra
                error (400, 404 o página en blanco), el problema es de Supabase Storage:
                <ul style={{ marginTop: 4 }}>
                  <li>
                    <strong>404</strong>: el archivo se borró del bucket. Solución: borra el anuncio y vuelve a publicarlo.
                  </li>
                  <li>
                    <strong>400/403</strong>: el bucket <code>images</code> no es público. Ve a Supabase → Storage → bucket <code>images</code> → Settings y márcalo como público (o revisa las políticas de <code>storage.objects</code>).
                  </li>
                  <li>
                    <strong>URL distinta</strong> al endpoint configurado arriba: el producto tiene un URL roto guardado. Borra ese anuncio y vuelve a publicar.
                  </li>
                </ul>
              </li>
              <li>
                Una vez ajustada la configuración de Supabase, usa{" "}
                <strong>Eliminar los X con imagen rota</strong> para limpiar de
                golpe y vuelve a{" "}
                <Link href="/add-product" style={{ color: "var(--brand)" }}>
                  publicar
                </Link>
                .
              </li>
            </ol>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
