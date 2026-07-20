"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import useChat from "@/hooks/useChat";
import useOrders from "@/hooks/useOrders";
import { parseOrderItems } from "@/helpers/dbHelpers";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function relativeTime(iso?: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(Math.round(diffSec), "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), "day");
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "is-pending" },
  processing: { label: "En proceso", cls: "is-pending" },
  shipped: { label: "Enviado", cls: "is-info" },
  delivered: { label: "Entregado", cls: "is-success" },
  cancelled: { label: "Cancelado", cls: "is-muted" },
};

export default function MyAccount() {
  const { user } = useAuth();
  const { getMyProducts } = useProducts();
  const { getMyConversations } = useChat();
  const { getMyOrders } = useOrders();

  const [listingCount, setListingCount] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [salesTotal, setSalesTotal] = useState<number | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);

    // Each source fails independently — one broken fetch must not blank the
    // whole dashboard. `failures` tracks whether *everything* died.
    let failures = 0;

    const [productRes, convRes, orderRes] = await Promise.all([
      getMyProducts(user.$id).catch(() => ({ success: false, data: null })),
      getMyConversations(user.$id).catch(() => ({ success: false, data: null })),
      getMyOrders().catch(() => ({ success: false, data: null })),
    ]);

    if (productRes.success && Array.isArray(productRes.data)) {
      setListingCount(productRes.data.length);
    } else {
      setListingCount(null);
      failures++;
    }

    if (convRes.success && Array.isArray(convRes.data)) {
      const convs = convRes.data;
      setConversations(convs.slice(0, 4));
      // "Awaiting your reply": the last message came from the other party.
      setUnreadCount(
        convs.filter(
          (c: any) => c.lastMessageAuthorId && c.lastMessageAuthorId !== user.$id,
        ).length,
      );
    } else {
      setConversations([]);
      setUnreadCount(null);
      failures++;
    }

    if (orderRes.success && Array.isArray(orderRes.data)) {
      const ords = orderRes.data;
      setOrders(ords.slice(0, 4));
      setOrderCount(ords.length);
      setSalesTotal(ords.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0));
    } else {
      setOrders([]);
      setOrderCount(null);
      setSalesTotal(null);
      failures++;
    }

    // Only a full wipeout shows the page-level error/retry.
    setError(failures === 3);
    setLoading(false);
  }, [user, getMyProducts, getMyConversations, getMyOrders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // "…" while loading, "—" when that specific metric failed, else the value.
  const metric = (v: number | null, fmt?: (n: number) => string) =>
    loading ? "…" : v === null ? "—" : fmt ? fmt(v) : String(v);

  const tiles = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      value: metric(listingCount),
      label: "Anuncios activos",
      href: "/my-account-listings",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      value: metric(unreadCount),
      label: "Mensajes sin responder",
      href: "/my-account-messages",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      value: metric(salesTotal, (n) => eur.format(n)),
      label: "Ventas totales",
      href: "/my-account-orders",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      value: metric(orderCount),
      label: "Pedidos",
      href: "/my-account-orders",
    },
  ];

  return (
    <div className="dashboard-v2-content">
      {/* Header greeting */}
      <div className="dashboard-v2-header">
        <div>
          <h1 className="dashboard-v2-greeting">
            Hola, {user?.name?.split(" ")[0] || "de nuevo"}
          </h1>
          <p className="dashboard-v2-subtitle">
            Lo que necesita tu atención hoy.
          </p>
        </div>
        <Link href="/add-product" className="btn-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Publicar
        </Link>
      </div>

      {error && (
        <div className="dashboard-v2-error" role="alert">
          <p>No pudimos cargar tu panel. Revisa tu conexión.</p>
          <button type="button" className="dashboard-v2-retry" onClick={fetchData}>
            Reintentar
          </button>
        </div>
      )}

      {/* Stat tiles — each links to its detail view */}
      <div className="dashboard-v2-stats">
        {tiles.map((tile, i) => (
          <Link key={i} href={tile.href} className="stat-tile">
            <div className="stat-icon">{tile.icon}</div>
            <div className="stat-value num">{tile.value}</div>
            <div className="stat-label">{tile.label}</div>
          </Link>
        ))}
      </div>

      {/* Two-col activity */}
      <div className="dashboard-v2-activity">
        <div className="dashboard-v2-activity-card">
          <header className="dashboard-v2-activity-head">
            <h2>Últimos mensajes</h2>
            <Link href="/my-account-messages" className="link-more">
              Ver todos →
            </Link>
          </header>
          {loading ? (
            <div className="dashboard-v2-empty-inline"><p>Cargando…</p></div>
          ) : conversations.length > 0 ? (
            <ul className="dashboard-v2-list">
              {conversations.map((c) => (
                <li key={c.id}>
                  <Link href="/my-account-messages" className="dashboard-v2-row">
                    <span className="dashboard-v2-row-main">
                      {c.lastMessage || "Conversación iniciada"}
                    </span>
                    <span className="dashboard-v2-row-meta">
                      {relativeTime(c.lastMessageAt || c.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dashboard-v2-empty-inline">
              <p>Aún no tienes mensajes.</p>
              <Link href="/shop-default" className="dashboard-v2-empty-cta">
                Explora productos y escribe a un vendedor →
              </Link>
            </div>
          )}
        </div>

        <div className="dashboard-v2-activity-card">
          <header className="dashboard-v2-activity-head">
            <h2>Últimas compras</h2>
            <Link href="/my-account-orders" className="link-more">
              Ver todas →
            </Link>
          </header>
          {loading ? (
            <div className="dashboard-v2-empty-inline"><p>Cargando…</p></div>
          ) : orders.length > 0 ? (
            <ul className="dashboard-v2-list">
              {orders.map((o) => {
                const items = parseOrderItems(o.items);
                const first = items[0];
                const extra = items.length > 1 ? ` +${items.length - 1}` : "";
                const st = ORDER_STATUS[o.status] || {
                  label: o.status || "—",
                  cls: "is-muted",
                };
                return (
                  <li key={o.id}>
                    <Link href="/my-account-orders" className="dashboard-v2-row">
                      <span className="dashboard-v2-row-main">
                        {(first?.title || "Pedido") + extra}
                      </span>
                      <span className="dashboard-v2-row-side">
                        <span className={`dashboard-v2-badge ${st.cls}`}>
                          {st.label}
                        </span>
                        <span className="dashboard-v2-row-price num">
                          {eur.format(o.totalAmount || 0)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="dashboard-v2-empty-inline">
              <p>Aún no has comprado nada.</p>
              <Link href="/shop-default" className="dashboard-v2-empty-cta">
                Descubre artículos cerca de ti →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
