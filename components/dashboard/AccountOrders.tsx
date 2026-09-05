"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useOrders from "@/hooks/useOrders";
import { Order } from "@/types/Types";
import { formatPrice } from "@/helpers/common";
import { EmptyState } from "@/components/common/Skeleton";
import { toast } from "react-toastify";
import { useConfirm } from "@/components/common/ConfirmDialog";

/** Status shown to the buyer, with the tone it should read in. */
const STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "Pendiente", tone: "warn" },
  processing: { label: "En preparación", tone: "brand" },
  shipped: { label: "Enviado", tone: "brand" },
  "on the way": { label: "En camino", tone: "brand" },
  delivered: { label: "Entregado", tone: "success" },
  cancelled: { label: "Cancelado", tone: "danger" },
};

function statusOf(status: string) {
  return STATUS[status?.toLowerCase()] || { label: status, tone: "neutral" };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseItems(items: unknown): any[] {
  if (Array.isArray(items)) return items;
  try {
    return JSON.parse(String(items));
  } catch {
    return [];
  }
}

export default function AccountOrders() {
  const { getMyOrders, updateOrderStatus } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const confirm = useConfirm();

  const fetchOrders = async () => {
    setIsLoading(true);
    const result = await getMyOrders();
    if (result.success) setOrders(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [getMyOrders]);

  const handleCancelOrder = async (orderId: string) => {
    const ok = await confirm({
      title: "¿Cancelar este pedido?",
      description:
        "El vendedor dejará de preparar el envío. Si ya has pagado, te devolvemos el importe.",
      confirmLabel: "Cancelar pedido",
      cancelLabel: "Volver",
      tone: "danger",
    });
    if (!ok) return;
    setCancelling(orderId);
    const result = await updateOrderStatus(orderId, "cancelled");
    setCancelling(null);
    if (result.success) {
      toast.success("Pedido cancelado");
      fetchOrders();
    } else {
      toast.error("No se pudo cancelar el pedido");
    }
  };

  if (isLoading) {
    return (
      <div className="my-account-content account-dashboard">
        <h4 className="orders-v2-heading">Mis pedidos</h4>
        <div className="orders-v2-list">
          {[1, 2].map((i) => (
            <div key={i} className="orders-v2-card is-loading" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-dashboard">
      <h4 className="orders-v2-heading">Mis pedidos</h4>

      {orders.length === 0 ? (
        <EmptyState
          illustration="package"
          title="Todavía no has comprado nada"
          description="Cuando compres un artículo, aquí verás su estado y el seguimiento del envío."
          action={{ label: "Explorar la tienda →", href: "/shop-default" }}
        />
      ) : (
        <ul className="orders-v2-list">
          {orders.map((order) => {
            const items = parseItems(order.items);
            const itemCount = items.reduce(
              (acc: number, item: any) => acc + (item.quantity || 1),
              0,
            );
            const { label, tone } = statusOf(order.status);
            const isPending = order.status?.toLowerCase() === "pending";
            const cancelled = order.status?.toLowerCase() === "cancelled";
            const paid = order.paymentStatus === "paid";
            const preview = items[0];

            return (
              <li key={order.id} className="orders-v2-card">
                <Link
                  href={`/order-details?orderId=${order.id}`}
                  className="orders-v2-card-main"
                >
                  <span className="orders-v2-thumb">
                    {preview?.imgSrc ? (
                      // Order items keep a snapshot of the image at purchase
                      // time, so this stays right even if the listing changes.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview.imgSrc} alt="" />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                        <path d="M2 4h20v4H2z" />
                        <path d="M10 12h4" />
                      </svg>
                    )}
                  </span>

                  <span className="orders-v2-info">
                    <span className="orders-v2-title">
                      {preview?.title || "Pedido"}
                      {itemCount > 1 && (
                        <span className="orders-v2-more">
                          {" "}
                          y {itemCount - 1}{" "}
                          {itemCount - 1 === 1 ? "artículo más" : "artículos más"}
                        </span>
                      )}
                    </span>
                    <span className="orders-v2-meta">
                      #{order.id.slice(0, 8)} · {formatDate(order.createdAt)}
                    </span>
                    {order.trackingNumber && (
                      <span className="orders-v2-meta">
                        Seguimiento: {order.trackingNumber}
                      </span>
                    )}
                  </span>

                  <span className="orders-v2-right">
                    <span className="orders-v2-total">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <span className={`orders-v2-chip is-${tone}`}>{label}</span>
                    {/* A cancelled order is never "waiting for payment" — saying
                        both at once reads as a system that lost track. */}
                    {!paid && !isPending && !cancelled && (
                      <span className="orders-v2-chip is-warn">Pago pendiente</span>
                    )}
                  </span>
                </Link>

                <div className="orders-v2-actions">
                  <Link
                    href={`/order-details?orderId=${order.id}`}
                    className="orders-v2-btn is-primary"
                  >
                    Ver pedido
                  </Link>
                  {isPending && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order.id)}
                      className="orders-v2-btn is-ghost"
                      disabled={cancelling === order.id}
                    >
                      {cancelling === order.id ? "Cancelando…" : "Cancelar"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
