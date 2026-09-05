"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function MobileTabBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const isActive = (prefix: string, exact = false) => {
    if (exact) return pathname === prefix;
    return pathname.startsWith(prefix);
  };

  return (
    <nav className="mobile-tabbar" aria-label="Navegación principal">
      <Link
        href="/"
        className={`mobile-tab ${isActive("/", true) ? "is-active" : ""}`}
      >
        <span className="mobile-tab-icon">
          <IconHome />
        </span>
        <span>Inicio</span>
      </Link>
      <Link
        href="/shop-default"
        className={`mobile-tab ${isActive("/shop") ? "is-active" : ""}`}
      >
        <span className="mobile-tab-icon">
          <IconSearch />
        </span>
        <span>Buscar</span>
      </Link>
      <Link href="/add-product" className="mobile-tab mobile-tab-fab" aria-label="Publicar">
        <IconPlus />
      </Link>
      <Link
        href="/mi-cuenta/mensajes"
        className={`mobile-tab ${isActive("/mi-cuenta/mensajes") ? "is-active" : ""}`}
      >
        <span className="mobile-tab-icon">
          <IconMessage />
        </span>
        <span>Chat</span>
      </Link>
      <Link
        href="/mi-cuenta"
        className={`mobile-tab ${
          pathname === "/mi-cuenta" ||
          (pathname.startsWith("/mi-cuenta") &&
            !pathname.includes("messages"))
            ? "is-active"
            : ""
        }`}
      >
        <span className="mobile-tab-icon">
          <IconUser />
        </span>
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
