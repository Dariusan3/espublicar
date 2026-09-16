"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";
import { useAuth } from "@/context/AuthContext";

/**
 * The subscription is settled by the webhook, which can land a beat after
 * Stripe redirects the buyer back here. Re-poll the session briefly so "ya
 * eres Pro" is what greets them, not a page that looks like nothing happened.
 */
export default function ProSuccessPage() {
  const { user, checkUser } = useAuth();
  const [checking, setChecking] = useState(user?.plan !== "pro");

  useEffect(() => {
    if (user?.plan === "pro") {
      setChecking(false);
      return;
    }
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts += 1;
      await checkUser();
      if (attempts >= 8) clearInterval(poll);
    }, 1500);
    return () => clearInterval(poll);
    // Intentionally only re-arms when plan flips, not on every checkUser identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.plan]);

  useEffect(() => {
    if (user?.plan === "pro") setChecking(false);
  }, [user?.plan]);

  return (
    <>
      <SiteHeader />
      <section className="legal-v2">
        <div className="legal-v2-container" style={{ maxWidth: 560, textAlign: "center" }}>
          <h1 className="legal-v2-title">
            {user?.plan === "pro" ? "¡Ya eres Pro!" : "Confirmando tu suscripción…"}
          </h1>
          <p className="legal-v2-lead">
            {user?.plan === "pro"
              ? "Envío gratis y ofertas destacadas, activos desde ahora."
              : checking
                ? "Esto tarda unos segundos."
                : "Si el pago se completó, verás el plan activo en cuanto recargues esta página."}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", marginTop: "var(--space-7)" }}>
            <Link href="/shop-default" className="btn-brand btn-lg">
              Seguir comprando
            </Link>
            <Link href="/pro" className="btn-ghost btn-lg">
              Ver mi plan
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
