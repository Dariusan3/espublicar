"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/common/NotificationBell";

export default function Header1() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop-default?query=${encodeURIComponent(q)}`);
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className={`tf-header style-2 ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="header-v2-inner">
        {/* Logo */}
        <Link href="/" className="header-v2-logo" aria-label="espublicar inicio">
          <Image
            alt="espublicar"
            src="/images/logo/logo.svg"
            width={140}
            height={32}
            priority
          />
        </Link>

        {/* Search bar (desktop) */}
        <form
          className="header-search"
          role="search"
          onSubmit={handleSearch}
        >
          <input
            type="search"
            className="input-search"
            placeholder="Busca cualquier cosa… iPhone, bici, sofá"
            aria-label="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right cluster */}
        <div className="header-v2-right">
          {/* Mobile search trigger */}
          <button
            type="button"
            className="header-icon-btn d-md-none"
            aria-label="Buscar"
            onClick={() => router.push("/shop-default")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Publicar button */}
          <Link href="/add-product" className="btn-brand btn-sm header-publicar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="header-publicar-text">Publicar</span>
          </Link>

          {/* Notifications (logged in) */}
          {user && <NotificationBell />}

          {/* Wishlist heart */}
          <Link href="/wishlist" className="header-icon-btn" aria-label="Favoritos">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          {/* Auth slot */}
          {user ? (
            <div className="header-avatar-wrap" ref={dropdownRef}>
              <button
                type="button"
                className="header-avatar"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Mi cuenta"
                aria-expanded={menuOpen}
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="header-avatar-menu glass">
                  <div className="header-avatar-menu-header">
                    <p className="header-avatar-menu-name">
                      {user.name || "Usuario"}
                    </p>
                    <p className="header-avatar-menu-email">{user.email}</p>
                  </div>
                  <div className="header-avatar-menu-divider" />
                  <Link
                    href="/my-account"
                    className="header-avatar-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="icon-user"></i> Mi perfil
                  </Link>
                  <Link
                    href="/my-account-listings"
                    className="header-avatar-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="icon-package"></i> Mis anuncios
                  </Link>
                  <Link
                    href="/my-account-messages"
                    className="header-avatar-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="icon-message-circle"></i> Mensajes
                  </Link>
                  <Link
                    href="/wishlist"
                    className="header-avatar-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="icon-heart"></i> Favoritos
                  </Link>
                  <Link
                    href="/my-account-edit"
                    className="header-avatar-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="icon-settings"></i> Configuración
                  </Link>
                  <div className="header-avatar-menu-divider" />
                  <button
                    type="button"
                    className="header-avatar-menu-item header-avatar-menu-item-danger"
                    onClick={async () => {
                      const result = await logout();
                      if (result.success) {
                        toast.success("Sesión cerrada");
                        setTimeout(() => (window.location.href = "/"), 800);
                      }
                    }}
                  >
                    <i className="icon-log-out"></i> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="#log"
              data-bs-toggle="modal"
              className="btn-ghost btn-sm header-entrar"
            >
              Entrar
            </a>
          )}

          {/* Mobile menu trigger */}
          <a
            href="#mobileMenu"
            data-bs-toggle="offcanvas"
            className="header-icon-btn d-md-none"
            aria-label="Menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
