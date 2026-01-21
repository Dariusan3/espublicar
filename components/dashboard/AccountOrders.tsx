"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useOrders from "@/hooks/useOrders";
import { Order } from "@/types/Types";

export default function AccountOrders() {
  const { getMyOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const result = await getMyOrders();
      if (result.success) {
        setOrders(result.data);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [getMyOrders]);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-delivered";
      case "shipped":
      case "on the way":
        return "text-on-the-way";
      case "processing":
        return "text-warning";
      case "cancelled":
        return "text-danger";
      default:
        return "text-muted";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const parseItems = (itemsJson: string) => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="my-account-content account-dashboard">
        <h4 className="fw-semibold mb-20">Order History</h4>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-dashboard">
      <h4 className="fw-semibold mb-20">Order History</h4>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">You haven't placed any orders yet.</p>
          <Link href="/shop-default" className="tf-btn">
            <span className="text-white">Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="tf-order_history-table">
          <table className="table_def">
            <thead>
              <tr>
                <th className="title-sidebar fw-medium">Order ID</th>
                <th className="title-sidebar fw-medium">Date</th>
                <th className="title-sidebar fw-medium">Status</th>
                <th className="title-sidebar fw-medium">Total</th>
                <th className="title-sidebar fw-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const items = parseItems(order.items);
                const itemCount = items.reduce(
                  (acc: number, item: any) => acc + (item.quantity || 1),
                  0,
                );
                return (
                  <tr key={order.id} className="td-order-item">
                    <td className="body-text-3">#{order.id.slice(0, 8)}</td>
                    <td className="body-text-3">
                      {formatDate(order.createdAt)}
                    </td>
                    <td
                      className={`body-text-3 ${getStatusClass(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </td>
                    <td className="body-text-3">
                      ${order.totalAmount.toFixed(2)} / {itemCount} item
                      {itemCount !== 1 ? "s" : ""}
                    </td>
                    <td>
                      <Link
                        href={`/order-details?orderId=${order.id}`}
                        className="tf-btn btn-small d-inline-flex"
                      >
                        <span className="text-white">Detail</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
