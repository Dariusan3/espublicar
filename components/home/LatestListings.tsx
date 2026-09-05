"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/productCards/ProductCard";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";
import { SkeletonGrid } from "@/components/common/Skeleton";

export default function ShopResultsWide() {
  const { searchProducts } = useProducts();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Fetch the first 16 and drop the 8 already shown above instead of
      // asking for offset 8 directly: a Range past the last row makes
      // PostgREST answer 416 whenever the catalogue has 8 items or fewer.
      const res = await searchProducts({ limit: 16, sortBy: "newest" });
      if (res.success && res.data) {
        setItems(res.data.products.slice(8));
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
              <ProductCard key={String(product.id)} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
