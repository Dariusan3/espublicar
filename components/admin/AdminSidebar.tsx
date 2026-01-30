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
    { name: "Dashboard", path: "/admin", icon: "icon-grid" },
    { name: "Products", path: "/admin/products", icon: "icon-box" },
    { name: "Orders", path: "/admin/orders", icon: "icon-shopping-bag" },
    { name: "Customers", path: "/admin/customers", icon: "icon-users" },
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
            Back to Shop
          </Link>
        </li>
        <li>
          <button
            onClick={async (e) => {
              e.preventDefault();
              await logout();
              toast.success("Logged out");
              window.location.href = "/";
            }}
            className="my-account-nav-item border-0 bg-transparent w-100 text-start text-danger"
          >
            <i className="icon-log-out me-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
