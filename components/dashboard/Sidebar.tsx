"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: "Mi cuenta", href: "/my-account", icon: "icon-user" },
    { name: "Mis anuncios", href: "/my-account-listings", icon: "icon-layers" },
    {
      name: "Mis pedidos (Envíos)",
      href: "/my-account-orders",
      icon: "icon-package",
    },
    { name: "Mis guardados", href: "/wishlist", icon: "icon-heart" },
    {
      name: "Mis mensajes",
      href: "#",
      icon: "icon-message-circle",
      badge: "0",
    }, // Placeholder
    {
      name: "Mis direcciones",
      href: "/my-account-address",
      icon: "icon-map-pin",
    },
    {
      name: "Detalles de la cuenta",
      href: "/my-account-edit",
      icon: "icon-settings",
    },
    { name: "Ayuda", href: "#", icon: "icon-help-circle" },
  ];

  return (
    <div
      className="sidebar-account p-4 rounded-4"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      {/* User Header */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-light">
        <div
          className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
          style={{ width: "50px", height: "50px" }}
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h6 className="mb-0 fw-bold text-dark">{user?.name || "Usuario"}</h6>
          <span className="text-muted small">Miembro desde 2024</span>
        </div>
      </div>

      {/* Vender Button CTA */}
      <Link
        href="/add-product"
        className="btn btn-warning w-100 fw-bold mb-4 d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm"
        style={{ color: "#1f1f1f" }}
      >
        <i className="icon-plus-square"></i> Vender
      </Link>

      <h6
        className="text-uppercase text-muted small fw-bold mb-3 ls-1"
        style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
      >
        Menú
      </h6>

      <ul className="my-account-nav list-unstyled mb-0 d-flex flex-column gap-1">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`d-flex align-items-center justify-content-between p-3 rounded-3 text-decoration-none transition-all ${
                pathname === item.href
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark hover-bg-light"
              }`}
              style={{ transition: "all 0.2s ease" }}
            >
              <div className="d-flex align-items-center gap-3">
                <i className={`${item.icon} fs-5`}></i>
                <span className="fw-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className="badge bg-danger rounded-pill">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={async (e) => {
              e.preventDefault();
              const result = await logout();
              if (result.success) {
                toast.success("👋 ¡Sesión cerrada!");
                setTimeout(() => {
                  window.location.href = "/";
                }, 1500);
              }
            }}
            className="d-flex align-items-center gap-3 p-3 rounded-3 w-100 text-start border-0 bg-transparent text-danger hover-bg-light transition-all"
            style={{ cursor: "pointer", transition: "all 0.2s ease" }}
          >
            <i className="icon-log-out fs-5"></i>
            <span className="fw-medium">Cerrar sesión</span>
          </button>
        </li>
      </ul>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}
