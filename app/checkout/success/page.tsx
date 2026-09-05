"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";
import useCart from "@/hooks/useCart";
import { db, DB_ID, COLLECTIONS } from "@/lib/supabase";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const sessionId = params.get("session_id");
  const { clearMyCart } = useCart();
  const [cleared, setCleared] = useState(false);
  const [paid, setPaid] = useState<boolean | null>(null);

  useEffect(() => {
    if (cleared) return;
    clearMyCart().finally(() => setCleared(true));
  }, [cleared, clearMyCart]);

  // Stripe redirects back without telling the app anything trustworthy, so ask
  // Stripe directly and only then mark the order paid. RLS keeps this write to
  // the buyer's own order, which is why it happens here and not in the route.
  useEffect(() => {
    if (!sessionId || paid !== null) return;
    let cancelled = false;

    const confirm = async () => {
      try {
        const res = await fetch(
          `/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = await res.json();
        if (cancelled) return;
        setPaid(!!data.paid);

        const targetOrder = orderId || data.orderId;
        if (data.paid && targetOrder) {
          await db.updateDocument(DB_ID, COLLECTIONS.ORDERS, targetOrder, {
            status: "processing",
            paymentStatus: "paid",
          });
        }
      } catch (error) {
        console.error("Could not confirm payment:", error);
        if (!cancelled) setPaid(false);
      }
    };

    confirm();
    return () => {
      cancelled = true;
    };
  }, [sessionId, orderId, paid]);

  return (
    <>
      <SiteHeader />
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

          <h1 className="legal-v2-title">
            {paid === false ? "Pago pendiente" : "¡Pago recibido!"}
          </h1>
          <p className="legal-v2-lead" style={{ marginInline: "auto" }}>
            {paid === false
              ? "Aún no hemos podido confirmar el cobro. Si el importe se ha cargado, tu pedido se actualizará en unos minutos."
              : "Tu pedido ha sido confirmado. El vendedor preparará el envío en las próximas 48 horas."}
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
                  : "/mi-cuenta/pedidos"
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
      <SiteFooter />
    </>
  );
}
