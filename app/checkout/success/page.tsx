"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import useCart from "@/hooks/useCart";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const { clearMyCart } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (cleared) return;
    clearMyCart().finally(() => setCleared(true));
  }, [cleared, clearMyCart]);

  return (
    <>
      <Header1 />
      <section className="legal-v2">
        <div className="legal-v2-container" style={{ maxWidth: 640, textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--success-bg)",
              color: "var(--success)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto var(--space-5)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="legal-v2-title">¡Pago recibido!</h1>
          <p className="legal-v2-lead" style={{ marginInline: "auto" }}>
            Tu pedido ha sido confirmado. El vendedor preparará el envío en las
            próximas 48 horas.
          </p>

          {orderId && (
            <p
              className="text-ink-3"
              style={{ fontSize: 13, marginTop: "var(--space-4)" }}
            >
              Referencia del pedido: <strong>{orderId.slice(0, 12)}…</strong>
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-3)",
              marginTop: "var(--space-7)",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={
                orderId
                  ? `/order-details?orderId=${orderId}`
                  : "/my-account-orders"
              }
              className="btn-brand btn-lg"
            >
              Ver mi pedido
            </Link>
            <Link href="/shop-default" className="btn-ghost btn-lg">
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
