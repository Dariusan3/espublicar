"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <>
      {" "}
      <li>
        <span className="my-account-nav-item active">Dashboard</span>
      </li>
      <li>
        <Link href={`/my-account-orders`} className="my-account-nav-item">
          Orders
        </Link>
      </li>
      <li>
        <Link href={`/my-account-address`} className="my-account-nav-item">
          Address
        </Link>
      </li>
      <li>
        <Link href={`/my-account-edit`} className="my-account-nav-item">
          Account Details
        </Link>
      </li>
      <li>
        <Link href={`/wishlist`} className="my-account-nav-item">
          Wishlist
        </Link>
      </li>
      <li>
        <button 
          onClick={async (e) => {
            e.preventDefault();
            await logout();
            window.location.href = '/';
          }} 
          className="my-account-nav-item border-0 bg-transparent w-100 text-start"
          style={{ cursor: "pointer" }}
        >
          Logout
        </button>
      </li>
    </>
  );
}
