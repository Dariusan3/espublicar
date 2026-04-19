"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Panel", path: "/admin", icon: "icon-grid" },
    { name: "Productos", path: "/admin/products", icon: "icon-box" },
    { name: "Pedidos", path: "/admin/orders", icon: "icon-shopping-bag" },
    { name: "Usuarios", path: "/admin/customers", icon: "icon-users" },
  ];

  return (
    <div className="tf-section-2 pt-0 sidebar-dashboard">
      <ul className="my-account-nav">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`my-account-nav-item ${pathname === item.path ? "active" : ""}`}
            >
              <i className={`${item.icon} me-2`} />
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <hr />
        </li>
        <li>
          <Link href="/" className="my-account-nav-item">
            <i className="icon-arrow-left me-2" />
            Volver a la tienda
          </Link>
        </li>
        <li>
          <button
            onClick={async (e) => {
              e.preventDefault();
              await logout();
              toast.success("Sesión cerrada");
              window.location.href = "/";
            }}
            className="my-account-nav-item border-0 bg-transparent w-100 text-start text-danger"
          >
            <i className="icon-log-out me-2" />
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
