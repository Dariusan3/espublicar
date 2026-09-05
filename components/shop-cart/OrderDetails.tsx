"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useOrders from "@/hooks/useOrders";
import { Order } from "@/types/Types";
import { parseOrderItems } from "@/helpers/dbHelpers";
import { formatPrice } from "@/helpers/common";

const PAYMENT_LABELS: Record<string, string> = {
  card: "Tarjeta",
  bizum: "Bizum",
  paypal: "PayPal",
};

const STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "Pendiente", tone: "warn" },
  processing: { label: "En preparación", tone: "brand" },
  shipped: { label: "Enviado", tone: "brand" },
  "on the way": { label: "En camino", tone: "brand" },
  delivered: { label: "Entregado", tone: "success" },
  cancelled: { label: "Cancelado", tone: "danger" },
};

/** The stages a buyer actually waits through, in order. */
const STAGES = [
  { key: "placed", label: "Pedido realizado" },
  { key: "paid", label: "Pago confirmado" },
  { key: "shipped", label: "Enviado" },
  { key: "delivered", label: "Entregado" },
];

/** How far along the stages this order is: -1 means it never started. */
function stageIndex(order: Order) {
  const status = order.status?.toLowerCase();
  if (status === "cancelled") return -1;
  if (status === "delivered") return 3;
  if (status === "shipped" || status === "on the way") return 2;
  if (order.paymentStatus === "paid" || status === "processing") return 1;
  return 0;
}

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    getOrderById(orderId).then((res) => {
      if (res.success) setOrder(res.data);
      setLoading(false);
    });
  }, [orderId, getOrderById]);

  if (loading) {
    return (
      <section className="order-v2">
        <div className="order-v2-container">
          <div className="order-v2-card is-loading" />
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="order-v2">
        <div className="order-v2-container order-v2-missing">
          <h1 className="order-v2-title">No encontramos ese pedido</h1>
          <p className="order-v2-lead">
            Puede que el enlace esté incompleto o que el pedido sea de otra
            cuenta.
          </p>
          <Link href="/mi-cuenta/pedidos" className="orders-v2-btn is-primary">
            Ver mis pedidos
          </Link>
        </div>
      </section>
    );
  }

  const items =
    typeof order.items === "string"
      ? parseOrderItems(order.items)
      : (order.items as any) || [];
  const address =
    typeof order.shippingAddress === "string"
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress;

  const itemsSubtotal = items.reduce(
    (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  // Fees and shipping are not stored separately, so show the difference as one
  // honest line instead of inventing a breakdown.
  const extras = Math.max(0, order.totalAmount - itemsSubtotal);
  const current = stageIndex(order);
  const cancelled = order.status?.toLowerCase() === "cancelled";
  const { label: statusLabel, tone } = STATUS[order.status?.toLowerCase()] || {
    label: order.status,
    tone: "neutral",
  };
  const paid = order.paymentStatus === "paid";

  return (
    <section className="order-v2">
      <div className="order-v2-container">
        <header className="order-v2-head">
          <div>
            <p className="order-v2-eyebrow">Pedido #{order.id.slice(0, 8)}</p>
            <h1 className="order-v2-title">
              {paid ? "Pago confirmado" : "Pedido registrado"}
            </h1>
            <p className="order-v2-lead">
              Realizado el{" "}
              {new Date(order.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              .{" "}
              {paid
                ? "Retenemos el importe hasta que confirmes que has recibido el artículo."
                : "En cuanto se confirme el cobro, avisaremos al vendedor."}
            </p>
          </div>
          <div className="order-v2-head-right">
            <span className={`orders-v2-chip is-${tone}`}>{statusLabel}</span>
            <span className="order-v2-amount">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </header>

        {cancelled ? (
          <div className="order-v2-cancelled">
            Este pedido se canceló. Si ya habías pagado, el importe se devuelve
            a tu método de pago.
          </div>
        ) : (
          <ol className="order-v2-track" aria-label="Estado del pedido">
            {STAGES.map((stage, i) => (
              <li
                key={stage.key}
                className={`order-v2-step ${
                  i < current ? "is-done" : i === current ? "is-current" : ""
                }`}
              >
                <span className="order-v2-dot" aria-hidden="true" />
                <span className="order-v2-step-label">{stage.label}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="order-v2-grid">
          <div className="order-v2-card">
            <h2 className="order-v2-card-title">Artículos</h2>
            <ul className="order-v2-items">
              {items.map((item: any, index: number) => (
                <li key={index} className="order-v2-item">
                  {item.imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imgSrc} alt="" className="order-v2-item-img" />
                  ) : (
                    <span className="order-v2-item-img is-empty" />
                  )}
                  <span className="order-v2-item-body">
                    <Link
                      href={`/product/${item.productId}`}
                      className="order-v2-item-title"
                    >
                      {item.title}
                    </Link>
                    <span className="order-v2-item-meta">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </span>
                  <span className="order-v2-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="order-v2-summary">
              <div>
                <dt>Artículos</dt>
                <dd>{formatPrice(itemsSubtotal)}</dd>
              </div>
              {extras > 0 && (
                <div>
                  <dt>Comisión y envío</dt>
                  <dd>{formatPrice(extras)}</dd>
                </div>
              )}
              <div className="order-v2-summary-total">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalAmount)}</dd>
              </div>
            </dl>
          </div>

          <div className="order-v2-side">
            <div className="order-v2-card">
              <h2 className="order-v2-card-title">Pago</h2>
              <p className="order-v2-line">
                {PAYMENT_LABELS[order.paymentMethod || ""] ||
                  order.paymentMethod ||
                  "Sin especificar"}
              </p>
              <span className={`orders-v2-chip is-${paid ? "success" : "warn"}`}>
                {paid ? "Pagado" : "Pendiente de cobro"}
              </span>
            </div>

            <div className="order-v2-card">
              <h2 className="order-v2-card-title">Envío</h2>
              {address ? (
                <address className="order-v2-address">
                  <span>
                    {address.firstName} {address.lastName}
                  </span>
                  <span>{address.address}</span>
                  <span>
                    {address.zipCode} {address.city}
                    {address.state ? `, ${address.state}` : ""}
                  </span>
                  <span>{address.country}</span>
                </address>
              ) : (
                <p className="order-v2-line">Recogida en mano</p>
              )}
              {order.trackingNumber && (
                <p className="order-v2-line">
                  Seguimiento: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </div>

            <div className="order-v2-card order-v2-help">
              <h2 className="order-v2-card-title">¿Algo no va bien?</h2>
              <p className="order-v2-line">
                Escribe al vendedor desde tus mensajes. Si el artículo no llega,
                recuperas tu dinero.
              </p>
              <Link href="/mi-cuenta/mensajes" className="orders-v2-btn is-ghost">
                Abrir mensajes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
