"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useOffers from "@/hooks/useOffers";
import useProducts from "@/hooks/useProducts";
import { Offer, Product } from "@/types/Types";
import { toast } from "react-toastify";
import Link from "next/link";
import { formatPrice } from "@/helpers/common";
import { EmptyState } from "@/components/common/Skeleton";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusLabels: Record<string, { label: string; tone: string }> = {
  pending: { label: "Pendiente", tone: "warn" },
  accepted: { label: "Aceptada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
  countered: { label: "Contraoferta", tone: "brand" },
  expired: { label: "Expirada", tone: "neutral" },
};

export default function MyOffers() {
  const { user } = useAuth();
  const { getMyOffers, getOffersForSeller, respondToOffer, loading } =
    useOffers();
  const { getProductById } = useProducts();

  const [tab, setTab] = useState<"sent" | "received">("received");
  const [sentOffers, setSentOffers] = useState<Offer[]>([]);
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([]);
  const [productCache, setProductCache] = useState<Record<string, Product>>({});
  const [counterAmounts, setCounterAmounts] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!user) return;
    loadOffers();
  }, [user]);

  const loadOffers = async () => {
    if (!user) return;
    const [sentRes, receivedRes] = await Promise.all([
      getMyOffers(user.$id),
      getOffersForSeller(user.$id),
    ]);

    const sent = sentRes.success ? sentRes.data : [];
    const received = receivedRes.success ? receivedRes.data : [];

    setSentOffers(sent);
    setReceivedOffers(received);

    // Load product info for all offers
    const allOffers = [...sent, ...received];
    const uniqueProductIds = [
      ...new Set(allOffers.map((o: Offer) => o.productId)),
    ];
    const newCache: Record<string, Product> = {};
    await Promise.all(
      uniqueProductIds.map(async (pid) => {
        const res = await getProductById(pid);
        if (res.success) newCache[pid] = res.data;
      }),
    );
    setProductCache((prev) => ({ ...prev, ...newCache }));
  };

  const handleRespond = async (
    offerId: string,
    status: "accepted" | "rejected" | "countered",
  ) => {
    const counterAmount =
      status === "countered"
        ? parseFloat(counterAmounts[offerId] || "0")
        : undefined;

    if (status === "countered" && (!counterAmount || counterAmount <= 0)) {
      toast.error("Introduce un precio válido para la contraoferta");
      return;
    }

    const result = await respondToOffer(offerId, status, counterAmount);
    if (result.success) {
      toast.success(result.message);
      loadOffers();
    } else {
      toast.error(result.message);
    }
  };

  const offers = tab === "sent" ? sentOffers : receivedOffers;
  const sent = tab === "sent";

  return (
    <div className="offers-v2">
      <h4 className="orders-v2-heading">Mis ofertas</h4>

      <div className="offers-v2-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!sent}
          className={`offers-v2-tab ${!sent ? "is-active" : ""}`}
          onClick={() => setTab("received")}
        >
          Recibidas
          <span className="offers-v2-tab-count">{receivedOffers.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sent}
          className={`offers-v2-tab ${sent ? "is-active" : ""}`}
          onClick={() => setTab("sent")}
        >
          Enviadas
          <span className="offers-v2-tab-count">{sentOffers.length}</span>
        </button>
      </div>

      {loading && (
        <ul className="orders-v2-list">
          <li className="orders-v2-card is-loading" />
        </ul>
      )}

      {!loading && offers.length === 0 && (
        <EmptyState
          illustration="tag"
          title={
            sent
              ? "Todavía no has hecho ninguna oferta"
              : "Todavía no has recibido ofertas"
          }
          description={
            sent
              ? "En los anuncios negociables puedes proponer tu precio al vendedor."
              : "Marca tus anuncios como negociables y los compradores podrán proponerte un precio."
          }
          action={
            sent
              ? { label: "Explorar la tienda →", href: "/shop-default" }
              : { label: "Ver mis anuncios →", href: "/mi-cuenta/anuncios" }
          }
        />
      )}

      {!loading && offers.length > 0 && (
        <ul className="orders-v2-list">
          {offers.map((offer) => {
            const product = productCache[offer.productId];
            const status = statusLabels[offer.status] || statusLabels.pending;
            const canRespond = !sent && offer.status === "pending";
            // How far the offer sits below the asking price, which is the one
            // number both sides are actually negotiating over.
            const gap =
              product && product.price > 0
                ? Math.round((1 - offer.amount / product.price) * 100)
                : null;

            return (
              <li key={offer.id} className="orders-v2-card">
                <div className="orders-v2-card-main">
                  <span className="orders-v2-thumb">
                    {product?.imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imgSrc} alt="" />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
                        <circle cx="7.5" cy="7.5" r="1.2" />
                      </svg>
                    )}
                  </span>

                  <span className="orders-v2-info">
                    <Link
                      href={`/product/${offer.productId}`}
                      className="orders-v2-title"
                    >
                      {product?.title || "Anuncio"}
                    </Link>
                    <span className="orders-v2-meta">
                      {formatDate(offer.createdAt)}
                      {product && (
                        <>
                          {" · "}Precio: {formatPrice(product.price)}
                        </>
                      )}
                    </span>
                    {offer.message && (
                      <span className="offers-v2-message">
                        &ldquo;{offer.message}&rdquo;
                      </span>
                    )}
                  </span>

                  <span className="orders-v2-right">
                    <span className="offers-v2-amount">
                      {formatPrice(offer.amount)}
                      {gap !== null && gap > 0 && (
                        <span className="offers-v2-gap">−{gap}%</span>
                      )}
                    </span>
                    <span className={`orders-v2-chip is-${status.tone}`}>
                      {status.label}
                    </span>
                    {offer.counterAmount && (
                      <span className="orders-v2-meta">
                        Contraoferta: {formatPrice(offer.counterAmount)}
                      </span>
                    )}
                  </span>
                </div>

                {canRespond && (
                  <div className="orders-v2-actions offers-v2-respond">
                    <button
                      type="button"
                      className="orders-v2-btn is-primary"
                      onClick={() => handleRespond(offer.id, "accepted")}
                    >
                      Aceptar {formatPrice(offer.amount)}
                    </button>
                    <button
                      type="button"
                      className="orders-v2-btn is-ghost"
                      onClick={() => handleRespond(offer.id, "rejected")}
                    >
                      Rechazar
                    </button>
                    <div className="offers-v2-counter">
                      <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="Tu precio"
                        aria-label="Importe de la contraoferta"
                        value={counterAmounts[offer.id] || ""}
                        onChange={(e) =>
                          setCounterAmounts((prev) => ({
                            ...prev,
                            [offer.id]: e.target.value,
                          }))
                        }
                      />
                      <span className="offers-v2-counter-unit">€</span>
                      <button
                        type="button"
                        className="orders-v2-btn is-ghost"
                        onClick={() => handleRespond(offer.id, "countered")}
                      >
                        Contraofertar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
