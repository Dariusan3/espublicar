"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard1 from "@/components/productCards/ProductCard1";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";
import { SkeletonGrid } from "@/components/common/Skeleton";

export default function Products3() {
  const { searchProducts } = useProducts();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await searchProducts({ limit: 8, offset: 8, sortBy: "newest" });
      if (res.success && res.data) {
        setItems(res.data.products);
      }
      setLoading(false);
    };
    load();
  }, [searchProducts]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="section-products">
      <div className="section-products-container">
        <header className="section-head">
          <h2>Últimas publicaciones</h2>
          <Link href="/shop-default" className="link-more">
            Ver más →
          </Link>
        </header>

        {loading ? (
          <SkeletonGrid count={4} />
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
