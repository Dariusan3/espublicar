"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useOffers from "@/hooks/useOffers";
import useProducts from "@/hooks/useProducts";
import { Offer, Product } from "@/types/Types";
import { toast } from "react-toastify";
import Link from "next/link";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendiente", class: "bg-warning text-dark" },
  accepted: { label: "Aceptada", class: "bg-success" },
  rejected: { label: "Rechazada", class: "bg-danger" },
  countered: { label: "Contraoferta", class: "bg-info" },
  expired: { label: "Expirada", class: "bg-secondary" },
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

  return (
    <div
      className="p-4 rounded-4"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      <h4 className="fw-bold mb-4">
        <i className="icon-tag me-2 text-primary"></i>
        Mis Ofertas
      </h4>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill ${tab === "received" ? "active" : ""}`}
            onClick={() => setTab("received")}
          >
            Recibidas ({receivedOffers.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill ${tab === "sent" ? "active" : ""}`}
            onClick={() => setTab("sent")}
          >
            Enviadas ({sentOffers.length})
          </button>
        </li>
      </ul>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm"></div>
        </div>
      )}

      {!loading && offers.length === 0 && (
        <div className="text-center py-5">
          <i className="icon-tag fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">
            {tab === "sent"
              ? "No has enviado ninguna oferta aún."
              : "No has recibido ofertas aún."}
          </p>
          <Link href="/shop-default" className="btn btn-primary rounded-pill">
            Explorar productos
          </Link>
        </div>
      )}

      {offers.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {offers.map((offer) => {
            const product = productCache[offer.productId];
            const status = statusLabels[offer.status] || statusLabels.pending;

            return (
              <div
                key={offer.id}
                className="d-flex align-items-start gap-3 p-3 rounded-3 border"
              >
                {/* Product info */}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Link
                      href={`/product/${offer.productId}`}
                      className="fw-semibold text-dark text-decoration-none"
                    >
                      {product?.title || "Producto"}
                    </Link>
                    <span className={`badge ${status.class} rounded-pill`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="d-flex gap-3 small text-muted mb-2">
                    <span>
                      Oferta:{" "}
                      <strong className="text-success">
                        €{offer.amount.toFixed(2)}
                      </strong>
                    </span>
                    {product && (
                      <span>
                        Precio: €{product.price.toFixed(2)}
                      </span>
                    )}
                    {offer.counterAmount && (
                      <span>
                        Contraoferta:{" "}
                        <strong className="text-info">
                          €{offer.counterAmount.toFixed(2)}
                        </strong>
                      </span>
                    )}
                    <span>{formatDate(offer.createdAt)}</span>
                  </div>

                  {offer.message && (
                    <p className="small text-muted mb-2 fst-italic">
                      &quot;{offer.message}&quot;
                    </p>
                  )}

                  {/* Seller actions for received offers */}
                  {tab === "received" && offer.status === "pending" && (
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-sm btn-success rounded-pill"
                        onClick={() => handleRespond(offer.id, "accepted")}
                      >
                        Aceptar
                      </button>
                      <button
                        className="btn btn-sm btn-danger rounded-pill"
                        onClick={() => handleRespond(offer.id, "rejected")}
                      >
                        Rechazar
                      </button>
                      <div className="d-flex gap-1 align-items-center">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="€ Contra"
                          style={{ width: "100px" }}
                          value={counterAmounts[offer.id] || ""}
                          onChange={(e) =>
                            setCounterAmounts((prev) => ({
                              ...prev,
                              [offer.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="btn btn-sm btn-info rounded-pill text-white"
                          onClick={() =>
                            handleRespond(offer.id, "countered")
                          }
                        >
                          Contraoferta
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
