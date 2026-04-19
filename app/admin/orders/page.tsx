"use client";
import React, { useEffect, useState } from "react";
import useAdmin from "@/hooks/useAdmin";
import { Order } from "@/types/Types";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendiente", class: "bg-warning text-dark" },
  processing: { label: "Procesando", class: "bg-info text-white" },
  shipped: { label: "Enviado", class: "bg-primary" },
  delivered: { label: "Entregado", class: "bg-success" },
  cancelled: { label: "Cancelado", class: "bg-danger" },
};

export default function AdminOrdersPage() {
  const { getAllOrders, updateOrderStatus, loading } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  const loadOrders = async () => {
    const res = await getAllOrders(limit, page * limit);
    if (res.success) {
      setOrders(res.data.orders);
      setTotal(res.data.total);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      toast.success("Estado actualizado");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } else {
      toast.error(res.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h3 className="fw-bold mb-4">Pedidos ({total})</h3>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm"></div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Cambiar Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const st = statusLabels[order.status] || statusLabels.pending;
              return (
                <tr key={order.id}>
                  <td className="fw-semibold small">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="text-muted small">
                    {new Date(order.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="fw-bold">€{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${st.class} rounded-pill`}>
                      {st.label}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === "paid"
                          ? "bg-success"
                          : "bg-secondary"
                      } rounded-pill`}
                    >
                      {order.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      style={{ width: "150px" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]?.label || s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
            </li>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
