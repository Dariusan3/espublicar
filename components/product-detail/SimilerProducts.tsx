"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/productCards/ProductCard";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";

interface SellerMoreListingsProps {
  sellerId?: string;
  currentProductId?: string;
}

export default function SimilerProducts({
  sellerId,
  currentProductId,
}: SellerMoreListingsProps) {
  const { searchProducts } = useProducts();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const res = await searchProducts({
        userId: sellerId,
        limit: 8,
        sortBy: "newest",
      });
      if (res.success && res.data) {
        const filtered = res.data.products.filter(
          (p: Product) => String(p.id) !== String(currentProductId),
        );
        setItems(filtered.slice(0, 4));
      }
      setLoading(false);
    };
    load();
  }, [sellerId, currentProductId, searchProducts]);

  if (!sellerId || (!loading && items.length === 0)) return null;

  return (
    <section className="section-products">
      <div className="section-products-container">
        <header className="section-head">
          <h2>Más de este vendedor</h2>
          <Link href={`/seller/${sellerId}`} className="link-more">
            Ver perfil →
          </Link>
        </header>
        {loading ? (
          <div className="section-products-loading">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="tf-grid-product">
            {items.map((product) => (
              <ProductCard key={String(product.id)} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
