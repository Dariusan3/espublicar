"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard1 from "@/components/productCards/ProductCard1";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";

export default function Products1() {
  const { searchProducts } = useProducts();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await searchProducts({ limit: 8, sortBy: "newest" });
      if (res.success && res.data) {
        setItems(res.data.products);
      }
      setLoading(false);
    };
    load();
  }, [searchProducts]);

  return (
    <section className="section-products">
      <div className="section-products-container">
        <header className="section-head">
          <div>
            <h2>Cerca de ti</h2>
            <p className="section-head-sub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Descubre artículos publicados recientemente</span>
            </p>
          </div>
          <Link href="/shop-default" className="link-more">
            Ver más →
          </Link>
        </header>

        {loading ? (
          <div className="section-products-loading">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : items.length === 0 ? (
          <div className="section-products-empty">
            <p>Aún no hay publicaciones. ¡Sé el primero en publicar!</p>
            <Link href="/add-product" className="btn-brand">
              Publicar anuncio
            </Link>
          </div>
        ) : (
          <div className="tf-grid-product">
            {items.map((product) => (
              <ProductCard1 key={String(product.id)} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
