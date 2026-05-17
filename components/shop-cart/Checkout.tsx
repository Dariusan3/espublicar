"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import useOrders, { OrderItem, ShippingAddress } from "@/hooks/useOrders";
import { toast } from "react-toastify";

type Delivery = "shipping" | "pickup";
type Payment = "card" | "bizum" | "paypal";

const SHIPPING_FEE = 4.5;
const SERVICE_FEE_RATE = 0.03; // 3% comisión de servicio

function formatPrice(p: number) {
  return p.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Checkout() {
  const router = useRouter();
  const { cart, clearMyCart } = useCart();
  const { createOrder } = useOrders();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [delivery, setDelivery] = useState<Delivery>("shipping");
  const [payment, setPayment] = useState<Payment>("card");

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "España",
  });
  const [phone, setPhone] = useState("");
  const [addressExtra, setAddressExtra] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const items = cart.items;
  const mainItem = items[0];
  const itemsSubtotal = cart.totalAmount;
  const serviceFee = itemsSubtotal * SERVICE_FEE_RATE;
  const shippingCost = delivery === "shipping" ? SHIPPING_FEE : 0;
  const totalPrice = itemsSubtotal + serviceFee + shippingCost;

  const isShippingValid =
    delivery !== "shipping" ||
    (address.firstName &&
      address.lastName &&
      address.address &&
      address.city &&
      address.zipCode &&
      phone);

  const isPaymentValid =
    payment !== "card" || (cardNumber && cardExp && cardCvc);

  const canSubmit = items.length > 0 && isShippingValid && isPaymentValid;

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Completa los datos de entrega y pago");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.productId,
        title: item.productTitle || "Artículo",
        price: item.productPrice || 0,
        quantity: item.quantity,
        imgSrc: item.productImage,
      }));

      // 1. Create the order (status: pending) in Appwrite
      const orderResult = await createOrder(
        orderItems,
        totalPrice,
        address,
        payment,
        "",
      );
      if (!orderResult.success) {
        toast.error("No se pudo crear el pedido");
        setIsSubmitting(false);
        return;
      }
      const orderId = orderResult.data.id;

      // 2. Create Stripe Checkout session and redirect
      const origin = window.location.origin;
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingCost,
          delivery,
          payment,
          orderId,
          successUrl: `${origin}/checkout/success`,
          cancelUrl: `${origin}/checkout/cancel?order_id=${orderId}`,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        // Fallback: if Stripe isn't configured, just complete the order locally
        if (data.error?.includes("Stripe no está configurado")) {
          toast.warning("Pagos en modo demo. Pedido registrado sin cobro.");
          await clearMyCart();
          router.push(`/order-details?orderId=${orderId}`);
          return;
        }
        toast.error(data.error || "Error al iniciar el pago");
        setIsSubmitting(false);
        return;
      }

      // 3. Redirect to Stripe Checkout (out of our app)
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast.error("Algo salió mal. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="checkout-v2-empty">
        <div className="checkout-v2-container">
          <h1 className="checkout-v2-title">No hay artículos para reservar</h1>
          <p className="text-ink-3 mb-4">
            Añade un artículo desde cualquier anuncio para completar tu compra.
          </p>
          <button
            className="btn-brand btn-lg"
            onClick={() => router.push("/shop-default")}
          >
            Explorar artículos
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-v2">
      <div className="checkout-v2-container">
        <h1 className="checkout-v2-title">Completa tu compra</h1>

        <div className="checkout-v2-grid">
          {/* Left column */}
          <div className="checkout-v2-main">
            {/* Card 1 — Artículo */}
            <div className="checkout-v2-card">
              <div className="checkout-v2-item">
                <div className="checkout-v2-item-thumb">
                  {mainItem?.productImage && (
                    <Image
                      src={mainItem.productImage}
                      alt={mainItem.productTitle || ""}
                      fill
                      className="checkout-v2-item-img"
                    />
                  )}
                </div>
                <div className="checkout-v2-item-info">
                  <p className="checkout-v2-item-title">
                    {mainItem?.productTitle || "Artículo"}
                  </p>
                  <p className="checkout-v2-item-meta">
                    Cantidad: {mainItem?.quantity || 1}
                  </p>
                </div>
                <p className="checkout-v2-item-price num">
                  {formatPrice(itemsSubtotal)} €
                </p>
              </div>
            </div>

            {/* Card 2 — Entrega */}
            <div className="checkout-v2-card">
              <h2 className="checkout-v2-section-title">
                ¿Cómo quieres recibirlo?
              </h2>
              <button
                type="button"
                className={`delivery-option ${delivery === "shipping" ? "is-selected" : ""}`}
                onClick={() => setDelivery("shipping")}
              >
                <span className="delivery-radio" aria-hidden="true" />
                <span className="delivery-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <span className="delivery-info">
                  <span className="delivery-title">Envío con espublicar</span>
                  <span className="delivery-sub">
                    Llega en 2–3 días con seguimiento
                  </span>
                </span>
                <span className="delivery-cost num">
                  {formatPrice(SHIPPING_FEE)} €
                </span>
              </button>
              <button
                type="button"
                className={`delivery-option ${delivery === "pickup" ? "is-selected" : ""}`}
                onClick={() => setDelivery("pickup")}
              >
                <span className="delivery-radio" aria-hidden="true" />
                <span className="delivery-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 11V7a5 5 0 0 0-10 0v4" />
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                  </svg>
                </span>
                <span className="delivery-info">
                  <span className="delivery-title">Recogida en mano</span>
                  <span className="delivery-sub">
                    Acuerda el punto de encuentro por chat
                  </span>
                </span>
                <span className="delivery-cost">Gratis</span>
              </button>
            </div>

            {/* Card 3 — Dirección (shipping only) */}
            {delivery === "shipping" && (
              <div className="checkout-v2-card">
                <h2 className="checkout-v2-section-title">
                  Dirección de envío
                </h2>
                <div className="checkout-v2-address">
                  <div className="checkout-v2-row-2">
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">
                        Nombre completo
                      </label>
                      <input
                        className="input-field"
                        value={`${address.firstName}${address.lastName ? " " + address.lastName : ""}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(" ");
                          setAddress((p) => ({
                            ...p,
                            firstName: parts[0] || "",
                            lastName: parts.slice(1).join(" ") || "",
                          }));
                        }}
                        placeholder="María Gómez"
                      />
                    </div>
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">Teléfono</label>
                      <input
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+34 600 000 000"
                      />
                    </div>
                  </div>
                  <div className="publicar-v2-field">
                    <label className="publicar-v2-label">Dirección</label>
                    <input
                      className="input-field"
                      value={address.address}
                      onChange={(e) =>
                        setAddress((p) => ({ ...p, address: e.target.value }))
                      }
                      placeholder="Calle Mayor 10"
                    />
                  </div>
                  <div className="publicar-v2-field">
                    <label className="publicar-v2-label">
                      Piso / escalera / puerta (opcional)
                    </label>
                    <input
                      className="input-field"
                      value={addressExtra}
                      onChange={(e) => setAddressExtra(e.target.value)}
                      placeholder="3º B"
                    />
                  </div>
                  <div className="checkout-v2-row-3">
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">Código postal</label>
                      <input
                        className="input-field"
                        value={address.zipCode}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, zipCode: e.target.value }))
                        }
                        placeholder="28001"
                      />
                    </div>
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">Ciudad</label>
                      <input
                        className="input-field"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, city: e.target.value }))
                        }
                        placeholder="Madrid"
                      />
                    </div>
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">Provincia</label>
                      <input
                        className="input-field"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, state: e.target.value }))
                        }
                        placeholder="Madrid"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card 4 — Pago */}
            <div className="checkout-v2-card">
              <h2 className="checkout-v2-section-title">¿Cómo pagas?</h2>

              {/* Card */}
              <button
                type="button"
                className={`delivery-option payment-option ${payment === "card" ? "is-selected" : ""}`}
                onClick={() => setPayment("card")}
              >
                <span className="delivery-radio" aria-hidden="true" />
                <span className="payment-logos">
                  <span className="payment-chip">VISA</span>
                  <span className="payment-chip">MC</span>
                </span>
                <span className="delivery-info">
                  <span className="delivery-title">
                    Tarjeta de crédito o débito
                  </span>
                </span>
              </button>
              {payment === "card" && (
                <div className="checkout-v2-card-fields">
                  <div className="publicar-v2-field">
                    <label className="publicar-v2-label">
                      Número de tarjeta
                    </label>
                    <input
                      className="input-field"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="checkout-v2-row-2">
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">Fecha</label>
                      <input
                        className="input-field"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div className="publicar-v2-field">
                      <label className="publicar-v2-label">CVC</label>
                      <input
                        className="input-field"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bizum */}
              <button
                type="button"
                className={`delivery-option payment-option ${payment === "bizum" ? "is-selected" : ""}`}
                onClick={() => setPayment("bizum")}
              >
                <span className="delivery-radio" aria-hidden="true" />
                <span className="payment-logos">
                  <span className="payment-chip payment-chip-bizum">Bizum</span>
                </span>
                <span className="delivery-info">
                  <span className="delivery-title">Bizum</span>
                  <span className="delivery-sub">
                    Usaremos tu número registrado en Bizum.
                  </span>
                </span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                className={`delivery-option payment-option ${payment === "paypal" ? "is-selected" : ""}`}
                onClick={() => setPayment("paypal")}
              >
                <span className="delivery-radio" aria-hidden="true" />
                <span className="payment-logos">
                  <span className="payment-chip payment-chip-paypal">
                    PayPal
                  </span>
                </span>
                <span className="delivery-info">
                  <span className="delivery-title">PayPal</span>
                </span>
              </button>
            </div>
          </div>

          {/* Right column — Summary */}
          <aside className="checkout-v2-summary">
            <div className="checkout-v2-summary-inner">
              <h2 className="checkout-v2-summary-title">Resumen</h2>

              <div className="checkout-v2-summary-lines">
                <div className="checkout-v2-summary-line">
                  <span>Artículo</span>
                  <span className="num">{formatPrice(itemsSubtotal)} €</span>
                </div>
                <div className="checkout-v2-summary-line">
                  <span>Comisión de servicio</span>
                  <span className="num">{formatPrice(serviceFee)} €</span>
                </div>
                <div className="checkout-v2-summary-line">
                  <span>Envío</span>
                  <span className="num">
                    {shippingCost === 0 ? "Gratis" : `${formatPrice(shippingCost)} €`}
                  </span>
                </div>
              </div>

              <div className="divider" />

              <div className="checkout-v2-summary-total">
                <span>Total a pagar</span>
                <span className="num">{formatPrice(totalPrice)} €</span>
              </div>

              <button
                type="button"
                className="btn-brand btn-lg btn-block checkout-v2-pay"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting
                  ? "Procesando…"
                  : `Pagar ${formatPrice(totalPrice)} € →`}
              </button>

              <ul className="checkout-v2-trust">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Pago retenido hasta que confirmes recibir el artículo</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>Reembolso íntegro si no llega o no es como se describe</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <p className="checkout-v2-legal">
          Al pulsar &ldquo;Pagar&rdquo; aceptas los Términos y la Política de
          privacidad. Pagos procesados de forma segura.
        </p>
      </div>

      {/* Sticky mobile pay bar */}
      <div className="checkout-v2-sticky-bar glass">
        <div className="checkout-v2-sticky-total">
          <span className="checkout-v2-sticky-total-label">Total</span>
          <span className="checkout-v2-sticky-total-value num">
            {formatPrice(totalPrice)} €
          </span>
        </div>
        <button
          type="button"
          className="btn-brand"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "Procesando…" : "Pagar"}
        </button>
      </div>
    </section>
  );
}
