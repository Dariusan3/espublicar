"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import useWishlist from "@/hooks/useWishlist";
import useSeller from "@/hooks/useSeller";
import { SellerProfile } from "@/hooks/useSeller";
import { useRouter } from "next/navigation";
import MakeOfferModal from "@/components/modals/MakeOfferModal";
import ReportModal from "@/components/modals/ReportModal";
import Slider1 from "./sliders/Slider1";

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  return `hace ${Math.floor(days / 30)} mes`;
}

function formatPrice(p: number) {
  if (p < 100) return p.toFixed(2);
  return Math.round(p).toString();
}

export default function Details1({ product }: { product: any }) {
  const { user } = useAuth();
  const { startConversation } = useChat();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getSellerProfile } = useSeller();
  const router = useRouter();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [seller, setSeller] = useState<SellerProfile | null>(null);

  const productIdStr = String((product as any).$id || product.id);
  const inWishlist = isInWishlist(productIdStr);

  useEffect(() => {
    if (!product?.userId) return;
    getSellerProfile(product.userId).then((res) => {
      if (res.success) setSeller(res.data);
    });
  }, [product?.userId, getSellerProfile]);

  const handleContactSeller = async () => {
    if (!user) {
      toast.error("Inicia sesión para contactar al vendedor");
      return;
    }
    if (user.$id === product.userId) {
      toast.warning("Este es tu propio producto");
      return;
    }
    const result = await startConversation(user.$id, product.userId, productIdStr);
    if (result.success) {
      router.push(`/my-account-messages?conversationId=${result.data.id}`);
    } else {
      toast.error("Error al iniciar la conversación");
    }
  };

  const handleOffer = () => {
    if (!user) {
      toast.error("Inicia sesión para hacer una oferta");
      return;
    }
    if (user.$id === product.userId) {
      toast.warning("Este es tu propio producto");
      return;
    }
    setShowOfferModal(true);
  };

  const handleWishlist = async () => {
    await toggleWishlist(productIdStr);
  };

  const discount =
    product.oldprice && product.oldprice > product.price
      ? Math.round(((product.oldprice - product.price) / product.oldprice) * 100)
      : 0;

  const images =
    product.thumbImages && product.thumbImages.length > 0
      ? product.thumbImages
      : [product.imgSrc].filter(Boolean);

  const sellerName = seller?.user.name || "Vendedor";
  const sellerInitial = sellerName.charAt(0).toUpperCase();
  const sellerRating = seller?.averageRating || 0;
  const sellerReviews = seller?.totalReviews || 0;
  const sellerListings = seller?.totalListings || 0;

  const isOwner = user?.$id === product.userId;

  return (
    <section className="pd-v2">
      <div className="pd-v2-container">
        {/* Breadcrumb */}
        <nav className="pd-v2-breadcrumb" aria-label="Navegación">
          <Link href="/">Inicio</Link>
          <span className="pd-v2-breadcrumb-sep">›</span>
          <Link href={`/shop-default?category=${encodeURIComponent(product.category || "")}`}>
            {product.category || "Categoría"}
          </Link>
          <span className="pd-v2-breadcrumb-sep">›</span>
          <span>{product.title}</span>
        </nav>

        <div className="pd-v2-grid">
          {/* Left: Gallery */}
          <div className="pd-v2-gallery">
            <Slider1
              firstIamge={product.imgSrc}
              images={images.length > 0 ? images : undefined}
            />
          </div>

          {/* Right: Info */}
          <div className="pd-v2-info">
            {/* Chip row */}
            <div className="pd-v2-chips">
              {product.condition && (
                <span className="chip chip-soft">{product.condition}</span>
              )}
              {product.isNegotiable && (
                <span className="chip chip-success">Negociable</span>
              )}
              {product.inStock && (
                <span className="chip">Envío disponible</span>
              )}
            </div>

            {/* Title + wishlist */}
            <div className="pd-v2-title-row">
              <h1 className="pd-v2-title">{product.title}</h1>
              <button
                type="button"
                className={`pd-v2-wishlist ${inWishlist ? "is-active" : ""}`}
                onClick={handleWishlist}
                aria-label={inWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Price */}
            <div className="pd-v2-price num">
              <span className="pd-v2-price-now">{formatPrice(product.price)} €</span>
              {product.oldprice && product.oldprice > product.price && (
                <>
                  <span className="pd-v2-price-was">
                    {formatPrice(product.oldprice)} €
                  </span>
                  <span className="chip chip-success">−{discount} %</span>
                </>
              )}
            </div>

            {/* Meta strip */}
            <div className="pd-v2-meta">
              {product.location && (
                <span className="pd-v2-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {product.location}
                </span>
              )}
              {product.createdAt && (
                <>
                  <span className="pd-v2-meta-dot" />
                  <span>Publicado {timeAgo(product.createdAt)}</span>
                </>
              )}
            </div>

            {/* CTA row */}
            {!isOwner && (
              <div className="pd-v2-ctas stack-3">
                <button
                  type="button"
                  className="btn-brand btn-lg btn-block"
                  onClick={handleContactSeller}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contactar al vendedor
                </button>
                {product.isNegotiable && (
                  <button
                    type="button"
                    className="btn-ghost btn-lg btn-block"
                    onClick={handleOffer}
                  >
                    Hacer una oferta
                  </button>
                )}
              </div>
            )}
            {isOwner && (
              <div className="pd-v2-owner-note">
                Este es tu anuncio.{" "}
                <Link href="/my-account-listings">Gestionarlo</Link>
              </div>
            )}

            {/* Seller card */}
            {product.userId && (
              <div className="pd-v2-seller">
                <div className="pd-v2-seller-avatar">{sellerInitial}</div>
                <div className="pd-v2-seller-info">
                  <p className="pd-v2-seller-name">{sellerName}</p>
                  <p className="pd-v2-seller-meta">
                    {sellerRating > 0 ? (
                      <>
                        <span className="pd-v2-stars">
                          {"★".repeat(Math.round(sellerRating))}
                          {"☆".repeat(5 - Math.round(sellerRating))}
                        </span>
                        {" "}
                        ({sellerRating.toFixed(1)}) · {sellerReviews}{" "}
                        {sellerReviews === 1 ? "opinión" : "opiniones"}
                      </>
                    ) : (
                      <>Sin valoraciones aún</>
                    )}
                    {sellerListings > 0 && (
                      <> · {sellerListings} {sellerListings === 1 ? "anuncio" : "anuncios"}</>
                    )}
                  </p>
                </div>
                <Link
                  href={`/seller/${product.userId}`}
                  className="pd-v2-seller-link"
                >
                  Ver perfil
                </Link>
              </div>
            )}

            {/* Trust strip */}
            <div className="pd-v2-trust">
              <div className="pd-v2-trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Pago seguro</span>
              </div>
              <div className="pd-v2-trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Envío con seguimiento</span>
              </div>
              <div className="pd-v2-trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                <span>Reembolso si no llega</span>
              </div>
            </div>

            {/* Report link */}
            {!isOwner && (
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                style={{
                  marginTop: "var(--space-3)",
                  background: "transparent",
                  border: 0,
                  color: "var(--ink-4)",
                  font: "500 13px/1 'Inter', sans-serif",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                  alignSelf: "flex-start",
                  padding: 0,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: "-2px" }}>
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                Reportar este anuncio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {!isOwner && (
        <div className="pd-v2-sticky-ctas glass">
          <button
            type="button"
            className="btn-brand btn-block"
            onClick={handleContactSeller}
          >
            Contactar
          </button>
          {product.isNegotiable && (
            <button
              type="button"
              className="btn-ghost btn-block"
              onClick={handleOffer}
            >
              Oferta
            </button>
          )}
        </div>
      )}

      {showOfferModal && (
        <MakeOfferModal
          productId={productIdStr}
          sellerId={product.userId}
          currentPrice={product.price}
          productTitle={product.title}
          onClose={() => setShowOfferModal(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          targetId={productIdStr}
          targetType="product"
          targetTitle={product.title}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </section>
  );
}
