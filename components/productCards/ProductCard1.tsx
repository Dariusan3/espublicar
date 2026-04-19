"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import useWishlist from "@/hooks/useWishlist";

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
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months}mes`;
  return `hace ${Math.floor(months / 12)}a`;
}

function formatPrice(price: number) {
  if (price < 100) return price.toFixed(2);
  return Math.round(price).toString();
}

interface ProductCardProps {
  product: any;
  index?: number;
  showSeller?: boolean;
}

export default function ProductCard1({
  product,
  showSeller = false,
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const productIdStr = String(product.id);
  const inWishlist = isInWishlist(productIdStr);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productIdStr);
  };

  const meta = timeAgo(product.createdAt || product.updatedAt);

  return (
    <div className="card-product-v2">
      <Link href={`/product/${product.id}`} className="card-v2-image">
        <Image
          alt={product.title}
          src={product.imgSrc}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="card-v2-img"
        />
        <button
          type="button"
          onClick={handleWishlist}
          className={`card-v2-heart ${inWishlist ? "is-active" : ""}`}
          aria-label={inWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </Link>

      <div className="card-v2-body">
        {(product.condition || product.isNegotiable) && (
          <div className="card-v2-chips">
            {product.condition && (
              <span className="chip chip-soft card-v2-chip-sm">
                {product.condition}
              </span>
            )}
            {product.isNegotiable && (
              <span className="chip chip-success card-v2-chip-sm">
                Negociable
              </span>
            )}
          </div>
        )}

        <Link href={`/product/${product.id}`} className="card-v2-title">
          {product.title}
        </Link>

        <div className="card-v2-price num">
          <span className="card-v2-price-now">
            {formatPrice(product.price)} €
          </span>
          {product.oldprice && product.oldprice > product.price && (
            <span className="card-v2-price-was">
              {formatPrice(product.oldprice)} €
            </span>
          )}
        </div>

        {(product.location || meta) && (
          <div className="card-v2-meta">
            {product.location && (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{product.location}</span>
              </>
            )}
            {product.location && meta && <span className="card-v2-dot" />}
            {meta && <span>{meta}</span>}
          </div>
        )}

        {showSeller && product.sellerName && (
          <div className="card-v2-seller">
            <div className="card-v2-seller-avatar">
              {product.sellerAvatar ? (
                <Image
                  alt={product.sellerName}
                  src={product.sellerAvatar}
                  width={20}
                  height={20}
                />
              ) : (
                <span>{product.sellerName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span>{product.sellerName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
