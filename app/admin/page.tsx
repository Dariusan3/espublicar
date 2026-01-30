"use client";
import React, { useEffect, useState } from "react";
import useOrders from "@/hooks/useOrders";
import useProducts from "@/hooks/useProducts";
import { formatCurrency } from "@/helpers/common";

export default function AdminDashboard() {
  const { getMyOrders } = useOrders(); // To be replaced with getAllOrders later
  const { products, totalCount } = useProducts();
  const [stats, setStats] = useState({
    sales: 0,
    orders: 0,
    products: 0,
  });

  useEffect(() => {
    // Simulating fetching admin stats for now
    // In a real app, this should call a dedicated admin API or aggregation function
    setStats({
      sales: 15430, // Mock data
      orders: 24, // Mock data
      products: totalCount || 0,
    });
  }, [totalCount]);

  return (
    <div>
      <h3 className="fw-5 mb-4">Admin Dashboard</h3>

      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card-stat p-4 border rounded bg-light">
            <div className="body-text text-secondary mb-2">Total Sales</div>
            <div className="h4">{formatCurrency(stats.sales)}</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card-stat p-4 border rounded bg-light">
            <div className="body-text text-secondary mb-2">Total Orders</div>
            <div className="h4">{stats.orders}</div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card-stat p-4 border rounded bg-light">
            <div className="body-text text-secondary mb-2">Total Products</div>
            <div className="h4">{stats.products}</div>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h5 className="fw-5 mb-3">Recent Activity</h5>
        <div className="p-4 border rounded text-center text-muted">
          No recent activity to show.
        </div>
      </div>
    </div>
  );
}
