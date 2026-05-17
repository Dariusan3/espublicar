"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";

export default function CheckoutCancelPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");

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
              background: "var(--warn-bg)",
              color: "var(--warn)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto var(--space-5)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 className="legal-v2-title">Pago cancelado</h1>
          <p className="legal-v2-lead" style={{ marginInline: "auto" }}>
            Has cancelado el pago. No se ha cobrado nada. Tu pedido sigue en
            estado pendiente — puedes volver a intentarlo cuando quieras.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-3)",
              marginTop: "var(--space-7)",
              flexWrap: "wrap",
            }}
          >
            <Link href="/checkout" className="btn-brand btn-lg">
              Volver al pago
            </Link>
            <Link href="/shop-default" className="btn-ghost btn-lg">
              Seguir explorando
            </Link>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
