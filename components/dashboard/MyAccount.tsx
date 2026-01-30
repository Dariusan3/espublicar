"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import useWishlist from "@/hooks/useWishlist";
import useOrders from "@/hooks/useOrders";
import { useAppSelector } from "@/store/store";

export default function MyAccount() {
  const { user } = useAuth();
  const { getMyProducts } = useProducts();
  const { getMyWishlist, wishlist } = useWishlist();
  const { getMyOrders } = useOrders();

  // Local state for stats
  const [listingCount, setListingCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoading(true);
        // Fetch listings count
        const productRes = await getMyProducts(user.$id);
        if (productRes.success && Array.isArray(productRes.data)) {
          setListingCount(productRes.data.length);
        }

        // Fetch wishlist
        await getMyWishlist();

        // Fetch orders
        const orderRes = await getMyOrders();
        if (orderRes.success && Array.isArray(orderRes.data)) {
          setOrderCount(orderRes.data.length);
        }

        setLoading(false);
      }
    }
    fetchData();
  }, [user, getMyProducts, getMyWishlist, getMyOrders]);

  const stats = [
    {
      title: "Total Listings",
      value: listingCount,
      icon: "icon-layers",
      color: "text-primary",
    },
    {
      title: "Total Orders",
      value: orderCount,
      icon: "icon-shopping-bag",
      color: "text-success",
    },
    {
      title: "Wishlist",
      value: wishlist.items.length,
      icon: "icon-heart",
      color: "text-danger",
    },
  ];

  const quickActions = [
    {
      title: "Sell Item",
      icon: "icon-plus",
      href: "/add-product",
      desc: "List a new product",
    },
    {
      title: "My Listings",
      icon: "icon-layers",
      href: "/my-account-listings",
      desc: "Manage your items",
    },
    {
      title: "Orders",
      icon: "icon-package",
      href: "/my-account-orders",
      desc: "Track purchases",
    },
    {
      title: "Profile",
      icon: "icon-user",
      href: "/my-account-edit",
      desc: "Edit details",
    },
  ];

  return (
    <div className="my-account-content account-dashboard">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Welcome back, {user?.name || "User"}! 👋
        </h2>
        <p className="text-muted">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-4 mb-3 mb-md-0">
            <div
              className="card border-0 shadow-sm h-100 p-4 rounded-4"
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p
                    className="text-muted mb-1 text-uppercase fw-semibold"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {stat.title}
                  </p>
                  <h3 className="fw-bold mb-0">
                    {loading ? "..." : stat.value}
                  </h3>
                </div>
                <div
                  className={`icon-box rounded-circle bg-light d-flex align-items-center justify-content-center ${stat.color}`}
                  style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}
                >
                  <i className={stat.icon}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h4 className="fw-bold mb-3">Quick Actions</h4>
      <div className="row mb-5">
        {quickActions.map((action, index) => (
          <div key={index} className="col-6 col-md-3 mb-3">
            <Link href={action.href} className="text-decoration-none">
              <div
                className="card h-100 border-0 shadow-sm rounded-4 p-3 text-center transition-all hover-lift"
                style={{ background: "#ffffff" }}
              >
                <div
                  className="mb-3 mx-auto rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                >
                  <i className={action.icon}></i>
                </div>
                <h6 className="fw-bold text-dark mb-1">{action.title}</h6>
                <span className="text-muted small">{action.desc}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Activity Section Placeholder */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 p-4">
          <h5 className="fw-bold mb-0">Recent Activity</h5>
        </div>
        <div className="card-body p-0">
          <div className="text-center py-5 text-muted">
            <i className="icon-clock mb-2" style={{ fontSize: "2rem" }}></i>
            <p>No recent activity to show.</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hover-lift {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .bg-primary-subtle {
          background-color: rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}
