"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/my-account" },
    { name: "My Listings", href: "/my-account-listings" }, // New C2C feature
    { name: "Sell Item", href: "/add-product" }, // New C2C feature
    { name: "Orders", href: "/my-account-orders" },
    { name: "Address", href: "/my-account-address" },
    { name: "Account Details", href: "/my-account-edit" },
    { name: "Wishlist", href: "/wishlist" },
  ];

  return (
    <ul className="my-account-nav">
      {menuItems.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={`my-account-nav-item ${
              pathname === item.href ? "active" : ""
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={async (e) => {
            e.preventDefault();
            const result = await logout();
            if (result.success) {
              toast.success("👋 Logged out successfully!");
              setTimeout(() => {
                window.location.href = "/";
              }, 1500);
            }
          }}
          className="my-account-nav-item border-0 bg-transparent w-100 text-start"
          style={{ cursor: "pointer" }}
        >
          Logout
        </button>
      </li>
    </ul>
  );
}
