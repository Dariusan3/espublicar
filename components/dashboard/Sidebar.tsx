"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

interface SidebarProps {
  counts?: {
    listings?: number;
    messages?: number;
    orders?: number;
    wishlist?: number;
    offers?: number;
    notifications?: number;
  };
}

export default function Sidebar({ counts = {} }: SidebarProps) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  const main = [
    { name: "Resumen", href: "/my-account", Icon: IconHome },
    { name: "Mis anuncios", href: "/my-account-listings", Icon: IconGrid, count: counts.listings },
    { name: "Mensajes", href: "/my-account-messages", Icon: IconMessage, count: counts.messages, countBrand: true },
    { name: "Compras", href: "/my-account-orders", Icon: IconBag, count: counts.orders },
    { name: "Mis ofertas", href: "/my-account-offers", Icon: IconTag, count: counts.offers },
    { name: "Favoritos", href: "/wishlist", Icon: IconHeart, count: counts.wishlist },
    { name: "Notificaciones", href: "/my-account-notifications", Icon: IconBell, count: counts.notifications, countBrand: true },
  ];

  const secondary = [
    { name: "Direcciones", href: "/my-account-address", Icon: IconPin },
    { name: "Configuración", href: "/my-account-edit", Icon: IconSettings },
  ];

  const renderItem = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <li key={item.name}>
        <Link
          href={item.href}
          className={`account-nav-item ${isActive ? "is-active" : ""}`}
        >
          <span className="account-nav-icon">
            <item.Icon />
          </span>
          <span className="account-nav-label">{item.name}</span>
          {item.count !== undefined && item.count > 0 && (
            <span
              className={`account-nav-count ${item.countBrand ? "is-brand" : ""}`}
            >
              {item.count}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside className="account-sidebar">
      {/* User card */}
      <div className="account-user-card">
        <div className="account-user-avatar">{initial}</div>
        <div className="account-user-info">
          <p className="account-user-name">{user?.name || "Usuario"}</p>
          <p className="account-user-email">{user?.email}</p>
        </div>
      </div>

      {/* Publicar CTA */}
      <Link href="/add-product" className="btn-brand btn-block account-sidebar-cta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Publicar
      </Link>

      {/* Nav */}
      <ul className="account-nav-list">
        {main.map(renderItem)}
        <li className="account-nav-sep" />
        {secondary.map(renderItem)}
        <li className="account-nav-sep" />
        <li>
          <button
            type="button"
            className="account-nav-item account-nav-item-logout"
            onClick={async () => {
              const result = await logout();
              if (result.success) {
                toast.success("Sesión cerrada");
                setTimeout(() => (window.location.href = "/"), 800);
              }
            }}
          >
            <span className="account-nav-icon">
              <IconLogout />
            </span>
            <span className="account-nav-label">Cerrar sesión</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
