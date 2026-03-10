"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useOrders from "@/hooks/useOrders";
import { Order } from "@/types/Types";
import { formatCurrency } from "@/helpers/common";
import { toast } from "react-toastify";

export default function AccountOrders() {
  const { getMyOrders, updateOrderStatus } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    const result = await getMyOrders();
    if (result.success) {
      setOrders(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [getMyOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
      const result = await updateOrderStatus(orderId, "cancelled");
      if (result.success) {
        toast.success("Pedido cancelado correctamente.");
        fetchOrders(); // Refresh the list
      } else {
        toast.error("No se pudo cancelar el pedido.");
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "Entregado";
      case "shipped":
        return "Enviado";
      case "on the way":
        return "En camino";
      case "processing":
        return "Procesando";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-delivered";
      case "shipped":
      case "on the way":
        return "text-on-the-way";
      case "processing":
      case "pending":
        return "text-warning";
      case "cancelled":
        return "text-danger";
      default:
        return "text-muted";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
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
        <h4 className="fw-semibold mb-20">Historial de Pedidos</h4>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-dashboard">
      <h4 className="fw-semibold mb-20">Historial de Pedidos</h4>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">Aún no has realizado ningún pedido.</p>
          <Link href="/product-grid" className="tf-btn">
            <span className="text-white">Empezar a comprar</span>
          </Link>
        </div>
      ) : (
        <div className="tf-order_history-table">
          <table className="table_def">
            <thead>
              <tr>
                <th className="title-sidebar fw-medium">Pedido</th>
                <th className="title-sidebar fw-medium">Fecha</th>
                <th className="title-sidebar fw-medium">Estado</th>
                <th className="title-sidebar fw-medium">Total</th>
                <th className="title-sidebar fw-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const items = parseItems(order.items);
                const itemCount = items.reduce(
                  (acc: number, item: any) => acc + (item.quantity || 1),
                  0,
                );
                const isPending = order.status.toLowerCase() === "pending";

                return (
                  <tr key={order.id} className="td-order-item">
                    <td className="body-text-3">
                      <div>#{order.id.slice(0, 8)}</div>
                      {order.trackingNumber && (
                        <div className="small text-muted mt-1">
                          Seguimiento: {order.trackingNumber}
                        </div>
                      )}
                    </td>
                    <td className="body-text-3">
                      {formatDate(order.createdAt)}
                    </td>
                    <td
                      className={`body-text-3 ${getStatusClass(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </td>
                    <td className="body-text-3">
                      {formatCurrency(order.totalAmount)} / {itemCount}{" "}
                      {itemCount === 1 ? "artículo" : "artículos"}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          href={`/order-details?orderId=${order.id}`}
                          className="tf-btn btn-small d-inline-flex px-3"
                        >
                          <span className="text-white">Detalles</span>
                        </Link>
                        {isPending && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="tf-btn btn-small d-inline-flex px-3 bg-danger"
                          >
                            <span className="text-white">Cancelar</span>
                          </button>
                        )}
                      </div>
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
