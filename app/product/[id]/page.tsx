"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import ProductDetail from "@/components/product-detail/ProductDetail";
import Description from "@/components/product-detail/Description";
import SimilerProducts from "@/components/product-detail/SimilerProducts";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "";
  const { getProductById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await getProductById(id);
      if (res.success) setProduct(res.data);
      setLoading(false);
    };
    load();
  }, [id, getProductById]);

  return (
    <>
      <SiteHeader />

      {loading && (
        <div className="section-products-loading" style={{ padding: "120px 0" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando…</span>
          </div>
        </div>
      )}

      {!loading && !product && (
        <section className="section-products">
          <div className="section-products-container text-center" style={{ padding: "80px 0" }}>
            <h2 className="fw-bold mb-3">Producto no encontrado</h2>
            <p className="text-ink-3 mb-4">
              Este anuncio no existe o ha sido eliminado.
            </p>
            <Link href="/shop-default" className="btn-brand">
              Volver a la tienda
            </Link>
          </div>
        </section>
      )}

      {product && (
        <>
          <ProductDetail product={product} />
          <Description product={product} />
          <SimilerProducts
            sellerId={product.userId}
            currentProductId={String(product.id)}
          />
        </>
      )}

      <SiteFooter />
    </>
  );
}
