"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const PRIMARY_TILES = [
  {
    href: "/",
    label: "Inicio",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/shop-default",
    label: "Buscar",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: "/add-product",
    label: "Publicar",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    brand: true,
  },
  {
    href: "/my-account-messages",
    label: "Mensajes",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/wishlist",
    label: "Favoritos",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: "/my-account-listings",
    label: "Mis anuncios",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

const CATEGORIES = [
  { slug: "Electrónica", name: "Electrónica" },
  { slug: "Moda", name: "Moda" },
  { slug: "Hogar", name: "Hogar" },
  { slug: "Vehículos", name: "Vehículos" },
  { slug: "Deportes", name: "Deportes" },
  { slug: "Libros", name: "Libros" },
];

export default function MobileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const closeMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (typeof window !== "undefined" && menu) {
      const bootstrap = require("bootstrap");
      const offcanvas = bootstrap.Offcanvas.getInstance(menu);
      if (offcanvas) offcanvas.hide();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/shop-default?query=${encodeURIComponent(q)}`);
    closeMenu();
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div
      className="offcanvas offcanvas-end mobile-menu-v2"
      id="mobileMenu"
      tabIndex={-1}
    >
      <div className="mobile-menu-v2-header">
        <Link href="/" className="mobile-menu-v2-logo" onClick={closeMenu}>
          <Image
            alt="espublicar"
            src="/images/logo/logo.svg"
            width={120}
            height={28}
          />
        </Link>
        <button
          type="button"
          className="mobile-menu-v2-close"
          data-bs-dismiss="offcanvas"
          aria-label="Cerrar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="mobile-menu-v2-body">
        {/* User block */}
        {user ? (
          <Link
            href="/my-account"
            className="mobile-menu-v2-user"
            onClick={closeMenu}
          >
            <div className="mobile-menu-v2-avatar">{initial}</div>
            <div className="mobile-menu-v2-user-info">
              <p className="mobile-menu-v2-user-name">
                {user.name || "Usuario"}
              </p>
              <p className="mobile-menu-v2-user-email">{user.email}</p>
            </div>
            <span className="mobile-menu-v2-user-link">Ver perfil →</span>
          </Link>
        ) : (
          <div className="mobile-menu-v2-auth">
            <a
              href="#log"
              data-bs-toggle="modal"
              className="btn-brand btn-block"
              onClick={closeMenu}
            >
              Iniciar sesión
            </a>
            <a
              href="#register"
              data-bs-toggle="modal"
              className="btn-ghost btn-block"
              onClick={closeMenu}
            >
              Crear cuenta
            </a>
          </div>
        )}

        {/* Search */}
        <form className="mobile-menu-v2-search" onSubmit={handleSearch}>
          <input
            type="search"
            className="input-search"
            placeholder="Busca cualquier cosa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Primary tiles */}
        <div className="mobile-menu-v2-tiles">
          {PRIMARY_TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={`mobile-menu-v2-tile ${tile.brand ? "is-brand" : ""}`}
              onClick={closeMenu}
            >
              <span className="mobile-menu-v2-tile-icon">{tile.icon}</span>
              <span className="mobile-menu-v2-tile-label">{tile.label}</span>
            </Link>
          ))}
        </div>

        {/* Categories list */}
        <div className="mobile-menu-v2-section">
          <p className="mobile-menu-v2-section-head">Categorías</p>
          <ul className="mobile-menu-v2-list">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/shop-default?category=${encodeURIComponent(cat.slug)}`}
                  className="mobile-menu-v2-list-item"
                  onClick={closeMenu}
                >
                  <span>{cat.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links */}
        <div className="mobile-menu-v2-footer">
          <Link href="/faq" onClick={closeMenu}>
            Ayuda
          </Link>
          <span>·</span>
          <Link href="/privacy" onClick={closeMenu}>
            Términos
          </Link>
          <span>·</span>
          <Link href="/privacy" onClick={closeMenu}>
            Privacidad
          </Link>
        </div>

        {user && (
          <button
            type="button"
            className="mobile-menu-v2-logout"
            onClick={async () => {
              const result = await logout();
              if (result.success) {
                closeMenu();
                toast.success("Sesión cerrada");
                setTimeout(() => (window.location.href = "/"), 800);
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}
