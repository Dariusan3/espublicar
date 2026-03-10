"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import useOrders, { OrderItem, ShippingAddress } from "@/hooks/useOrders";
import { toast } from "react-toastify";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearMyCart } = useCart();
  const { createOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [contact, setContact] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");

  const cartProducts = cart.items;
  const totalPrice = cart.totalAmount;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartProducts.length === 0) {
      toast.error("¡Tu carrito está vacío!");
      return;
    }

    // Validate required fields
    if (
      !contact ||
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.zipCode
    ) {
      toast.error("Por favor, rellena todos los campos obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items
      const orderItems: OrderItem[] = cartProducts.map((item) => ({
        productId: item.productId,
        title: item.productTitle || "Product",
        price: item.productPrice || 0,
        quantity: item.quantity,
        imgSrc: item.productImage,
      }));

      // Create order
      const result = await createOrder(
        orderItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
        orderNotes,
      );

      if (result.success) {
        // Clear cart after successful order
        await clearMyCart();

        // Redirect to order confirmation
        router.push(`/order-details?orderId=${result.data.id}`);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Algo salió mal. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar next" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href={`/shop-cart`} className="link body-text-3">
                Carrito
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link
                href={`/checkout`}
                className="text-secondary link body-text-3"
              >
                Envío y Pago
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <span className="link body-text-3">Confirmación</span>
            </div>
          </div>
        </div>
        <form
          onSubmit={handlePlaceOrder}
          className="tf-checkout-wrap flex-lg-nowrap"
        >
          <div className="page-checkout">
            <div className="wrap">
              <h5 className="title has-account">
                <span className="fw-semibold">Contacto</span>
                <span className="body-text-3">
                  ¿Ya tienes cuenta?
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="body-text-3 text-secondary link"
                  >
                    Inicia sesión
                  </a>
                </span>
              </h5>
              <div className="form-checkout-contact">
                <label className="body-md-2 fw-semibold">
                  Email o Teléfono
                </label>
                <input
                  className="def"
                  type="text"
                  placeholder="Tu contacto"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <p className="caption text-main-2 font-2">
                  La información del pedido se enviará a tu correo electrónico
                </p>
              </div>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Entrega</h5>
              <div className="def">
                <fieldset>
                  <label>País/Región</label>
                  <div className="tf-select">
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona tu País/Región</option>
                      <option value="ES">España</option>
                      <option value="US">Estados Unidos</option>
                      <option value="UK">Reino Unido</option>
                      <option value="CA">Canadá</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Alemania</option>
                      <option value="FR">Francia</option>
                    </select>
                  </div>
                </fieldset>
                <div className="cols">
                  <fieldset>
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="ej. Juan"
                      value={shippingAddress.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label>Apellidos *</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="ej. Pérez"
                      value={shippingAddress.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset>
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="ej. Madrid"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label>Provincia</label>
                    <div className="tf-select">
                      <select
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecciona</option>
                        <option value="M">Madrid</option>
                        <option value="B">Barcelona</option>
                        <option value="V">Valencia</option>
                        <option value="S">Sevilla</option>
                        <option value="Z">Zaragoza</option>
                        <option value="MA">Málaga</option>
                      </select>
                    </div>
                  </fieldset>
                  <fieldset>
                    <label>Código Postal *</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ej. 28001"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>
                <fieldset>
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Tu dirección detallada"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
                <fieldset>
                  <label>Nota del pedido</label>
                  <textarea
                    placeholder="Nota sobre tu pedido"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </fieldset>
              </div>
            </div>
            <div className="wrap">
              <h5 className="title">Pago</h5>
              <div className="form-payment">
                <div className="payment-box" id="payment-box">
                  <div
                    className={`payment-item ${paymentMethod === "card" ? "active" : ""}`}
                  >
                    <label
                      htmlFor="credit-card-method"
                      className="payment-header"
                      onClick={() => setPaymentMethod("card")}
                    >
                      <span className="body-md-2 fw-semibold title">
                        Tarjeta de Crédito/Débito
                      </span>
                      <input
                        type="radio"
                        name="payment-method"
                        className="d-none tf-check-rounded"
                        id="credit-card-method"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                    </label>
                    {paymentMethod === "card" && (
                      <div className="payment-body">
                        <fieldset>
                          <label>Número de Tarjeta</label>
                          <input
                            type="text"
                            className="number-credit-card"
                            placeholder="xxxx xxxx xxxx xxxx"
                          />
                        </fieldset>
                        <div className="cols">
                          <fieldset>
                            <label>Fecha de expiración</label>
                            <input type="text" placeholder="MM/AA" />
                          </fieldset>
                          <fieldset>
                            <label>CVV</label>
                            <input type="text" placeholder="xxx" />
                          </fieldset>
                        </div>
                        <fieldset>
                          <label>Nombre en la tarjeta</label>
                          <input type="text" placeholder="ej. JUAN PÉREZ" />
                        </fieldset>
                      </div>
                    )}
                  </div>
                  <div
                    className={`payment-item ${paymentMethod === "cash" ? "active" : ""}`}
                  >
                    <label
                      htmlFor="delivery-method"
                      className="payment-header radio-item"
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <span className="body-text-3">Pago contra reembolso</span>
                    </label>
                  </div>
                </div>
                <div className="box-btn">
                  <button
                    type="submit"
                    className="tf-btn w-100"
                    disabled={isSubmitting || cartProducts.length === 0}
                  >
                    <span className="text-white">
                      {isSubmitting
                        ? "Tramitando Pedido..."
                        : "Realizar Pedido"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flat-sidebar-checkout">
            <div className="sidebar-checkout-content">
              <h5 className="fw-semibold">Resumen del Pedido</h5>
              {cartProducts.length ? (
                <ul className="list-product">
                  {cartProducts.map((item, i) => (
                    <li key={i} className="item-product">
                      <a href="#" className="img-product">
                        <Image
                          alt=""
                          src={item.productImage || "/images/placeholder.jpg"}
                          width={500}
                          height={500}
                        />
                      </a>
                      <div className="content-box">
                        <a
                          href="#"
                          className="link-secondary body-md-2 fw-semibold"
                        >
                          {item.productTitle || "Producto"}
                        </a>
                        <p className="price-quantity price-text fw-semibold">
                          {item.productPrice
                            ? `${item.productPrice.toFixed(2)}€`
                            : "0.00€"}
                          <span className="body-md-2 text-main-2 fw-normal">
                            {" "}
                            x{item.quantity}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4">
                  <div className="col-4">
                    Tu carrito está vacío. ¡Empieza a añadir tus productos
                    favoritos!
                  </div>
                  <Link
                    className="tf-btn mt-2 mb-3 text-white"
                    style={{ width: "fit-content" }}
                    href="/product-grid"
                  >
                    Explorar Productos
                  </Link>
                </div>
              )}
              <div className="">
                <p className="body-md-2 fw-semibold sub-type">
                  Código de descuento
                </p>
                <div className="ip-discount-code style-2">
                  <input type="text" className="def" placeholder="Tu código" />
                  <button type="button" className="tf-btn btn-gray-2">
                    <span>Aplicar</span>
                  </button>
                </div>
              </div>
              <ul className="sec-total-price">
                <li>
                  <span className="body-text-3">Subtotal</span>
                  <span className="body-text-3">{totalPrice.toFixed(2)}€</span>
                </li>
                <li>
                  <span className="body-text-3">Envío</span>
                  <span className="body-text-3">Gratis</span>
                </li>
                <li>
                  <span className="body-md-2 fw-semibold">Total</span>
                  <span className="body-md-2 fw-semibold text-primary">
                    {totalPrice.toFixed(2)}€
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
