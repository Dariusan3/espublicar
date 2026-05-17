"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useWishlist from "@/hooks/useWishlist";
import useProducts from "@/hooks/useProducts";
import ProductCard1 from "@/components/productCards/ProductCard1";
import { Product } from "@/types/Types";
import { toast } from "react-toastify";
import { SkeletonGrid, EmptyState } from "@/components/common/Skeleton";

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, getMyWishlist, clearMyWishlist } = useWishlist();
  const { getProductById } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getMyWishlist();
  }, [user, getMyWishlist]);

  useEffect(() => {
    if (!wishlist.items || wishlist.items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const loaded: Product[] = [];
      await Promise.all(
        wishlist.items.map(async (productId) => {
          try {
            const res = await getProductById(String(productId));
            if (res.success && res.data) {
              loaded.push(res.data);
            }
          } catch {
            // Product may have been deleted — skip silently
          }
        }),
      );
      setProducts(loaded);
      setLoading(false);
    };
    load();
  }, [wishlist.items, getProductById]);

  const handleClearAll = async () => {
    if (!window.confirm("¿Eliminar todos tus favoritos?")) return;
    setIsClearing(true);
    const res = await clearMyWishlist();
    if (res.success) {
      setProducts([]);
      toast.success("Favoritos vaciados");
    }
    setIsClearing(false);
  };

  if (!user) {
    return (
      <section className="section-products">
        <div
          className="section-products-container text-center"
          style={{ padding: "80px 0" }}
        >
          <h2 className="fw-bold mb-3">Inicia sesión para ver tus favoritos</h2>
          <p className="text-ink-3 mb-4">
            Guarda los artículos que te interesan y accede a ellos desde
            cualquier dispositivo.
          </p>
          <a href="#log" data-bs-toggle="modal" className="btn-brand btn-lg">
            Iniciar sesión
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="section-products">
      <div className="section-products-container">
        <header className="section-head">
          <div>
            <h2>Mis favoritos</h2>
            {products.length > 0 && (
              <p className="section-head-sub">
                <span>
                  {products.length}{" "}
                  {products.length === 1
                    ? "artículo guardado"
                    : "artículos guardados"}
                </span>
              </p>
            )}
          </div>
          {products.length > 0 && (
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={handleClearAll}
              disabled={isClearing}
            >
              {isClearing ? "Eliminando…" : "Vaciar favoritos"}
            </button>
          )}
        </header>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : products.length === 0 ? (
          <EmptyState
            illustration="heart"
            title="Aún no tienes favoritos guardados"
            description="Toca el corazón en cualquier anuncio para guardarlo aquí y volver más tarde."
            action={{ label: "Explorar productos", href: "/shop-default" }}
          />
        ) : (
          <div className="tf-grid-product">
            {products.map((product) => (
              <ProductCard1 key={String(product.id)} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
