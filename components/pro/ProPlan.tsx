"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const PRICE_LABEL = "2,99 €";

const PERKS: { title: string; body: string; status: "live" | "soon" }[] = [
  {
    title: "Envío gratis",
    body: "Cuando el vendedor ofrezca envío, no pagas los 4,50 € del transporte. Se amortiza solo con tu segundo pedido.",
    status: "live",
  },
  {
    title: "Tu oferta destaca",
    body: "Cuando propones un precio, el vendedor te ve el primero, marcado como comprador Pro, entre todas las ofertas que recibe.",
    status: "live",
  },
  {
    title: "Aviso antes que nadie",
    body: "Guarda una búsqueda y te avisamos en cuanto se publique algo que encaja, antes de que se venda. Próximamente.",
    status: "soon",
  },
];

/** Opens the login modal that lives in the root layout. */
function openLogin() {
  const trigger = document.querySelector<HTMLElement>(
    '[data-bs-target="#log"], a[href="#log"]',
  );
  trigger?.click();
}

export default function ProPlan() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isPro = user?.plan === "pro";

  const handleSubscribe = async () => {
    if (!user) {
      toast.info("Inicia sesión para hacerte Pro");
      openLogin();
      return;
    }
    setLoading(true);
    try {
      // The server derives who's asking from this token — it never trusts
      // an id passed in the body, so this has to be an active session's own
      // access token, not the buyer's account id.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        setLoading(false);
        return;
      }
      const origin = window.location.origin;
      const res = await fetch("/api/pro/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          successUrl: `${origin}/pro/success`,
          cancelUrl: `${origin}/pro`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error || "No se pudo iniciar la suscripción");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Algo salió mal. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  const handleManage = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/pro/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error || "No se pudo abrir la gestión de la suscripción");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Algo salió mal. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <section className="pro-v2">
      <div className="pro-v2-container">
        <header className="pro-v2-head">
          <span className="pro-v2-eyebrow">espublicar Pro</span>
          <h1 className="pro-v2-title">
            Para quien compra de segunda mano a menudo
          </h1>
          <p className="pro-v2-lead">
            Nada de esto cambia lo básico: pago seguro, chat con el vendedor y
            recogida en mano siguen siendo gratis para todo el mundo. Pro es
            un extra para quien compra seguido.
          </p>
        </header>

        <div className="pro-v2-grid">
          <ul className="pro-v2-perks">
            {PERKS.map((perk) => (
              <li key={perk.title} className="pro-v2-perk">
                <div className="pro-v2-perk-head">
                  <h3>{perk.title}</h3>
                  {perk.status === "soon" && (
                    <span className="pro-v2-soon">Próximamente</span>
                  )}
                </div>
                <p>{perk.body}</p>
              </li>
            ))}
          </ul>

          <div className="pro-v2-card">
            {isPro ? (
              <>
                <span className="pro-v2-badge">Ya eres Pro</span>
                <p className="pro-v2-renews">
                  {user?.planRenewsAt
                    ? `Se renueva el ${new Date(user.planRenewsAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`
                    : "Suscripción activa"}
                </p>
                <button
                  type="button"
                  className="orders-v2-btn is-ghost pro-v2-btn"
                  onClick={handleManage}
                  disabled={loading}
                >
                  {loading ? "Abriendo…" : "Gestionar suscripción"}
                </button>
              </>
            ) : (
              <>
                <p className="pro-v2-price">
                  {PRICE_LABEL}
                  <span>/mes</span>
                </p>
                <p className="pro-v2-price-sub">Cancela cuando quieras.</p>
                <button
                  type="button"
                  className="orders-v2-btn is-primary pro-v2-btn"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? "Abriendo…" : "Hazte Pro"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
