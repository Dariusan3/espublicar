"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import useWishlist from "@/hooks/useWishlist";
import useOrders from "@/hooks/useOrders";

function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function MyAccount() {
  const { user } = useAuth();
  const { getMyProducts } = useProducts();
  const { getMyWishlist, wishlist } = useWishlist();
  const { getMyOrders } = useOrders();

  const [listingCount, setListingCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);

      const productRes = await getMyProducts(user.$id);
      if (productRes.success && Array.isArray(productRes.data)) {
        setListingCount(productRes.data.length);
      }

      await getMyWishlist();

      const orderRes = await getMyOrders();
      if (orderRes.success && Array.isArray(orderRes.data)) {
        setOrderCount(orderRes.data.length);
        const total = orderRes.data.reduce(
          (sum: number, o: any) => sum + (o.totalAmount || 0),
          0,
        );
        setSalesTotal(total);
      }

      setLoading(false);
    }
    fetchData();
  }, [user, getMyProducts, getMyWishlist, getMyOrders]);

  const tiles = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      value: listingCount,
      label: "Anuncios activos",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      value: 0,
      label: "Mensajes sin leer",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      value: `${formatCurrency(salesTotal)} €`,
      label: "Ventas totales",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      value: orderCount,
      label: "Pedidos",
    },
  ];

  return (
    <div className="dashboard-v2-content">
      {/* Header greeting */}
      <div className="dashboard-v2-header">
        <div>
          <h1 className="dashboard-v2-greeting">
            Hola, {user?.name?.split(" ")[0] || "usuario"}
          </h1>
          <p className="dashboard-v2-subtitle">
            Esto es lo que está pasando con tu cuenta.
          </p>
        </div>
        <Link href="/add-product" className="btn-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Publicar
        </Link>
      </div>

      {/* Stat tiles */}
      <div className="dashboard-v2-stats">
        {tiles.map((tile, i) => (
          <div key={i} className="stat-tile">
            <div className="stat-icon">{tile.icon}</div>
            <div className="stat-value num">
              {loading ? "…" : tile.value}
            </div>
            <div className="stat-label">{tile.label}</div>
          </div>
        ))}
      </div>

      {/* Two-col cards */}
      <div className="dashboard-v2-activity">
        <div className="dashboard-v2-activity-card">
          <header className="dashboard-v2-activity-head">
            <h2>Últimos mensajes</h2>
            <Link href="/my-account-messages" className="link-more">
              Ver todos →
            </Link>
          </header>
          <div className="dashboard-v2-empty-inline">
            <p>Aún no tienes mensajes.</p>
          </div>
        </div>

        <div className="dashboard-v2-activity-card">
          <header className="dashboard-v2-activity-head">
            <h2>Últimas compras</h2>
            <Link href="/my-account-orders" className="link-more">
              Ver todas →
            </Link>
          </header>
          <div className="dashboard-v2-empty-inline">
            <p>Aún no has comprado nada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
