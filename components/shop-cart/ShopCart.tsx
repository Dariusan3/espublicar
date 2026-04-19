"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useCart from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/helpers/common";

export default function ShopCart() {
  const { user } = useAuth();
  const { cart, getMyCart, updateCartItemQuantity, removeCartItem } = useCart();
  const [loading, setLoading] = useState(true);

  // Fetch cart on load
  useEffect(() => {
    if (user) {
      getMyCart().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, getMyCart]);

  console.log("ShopCart: Current cart state", cart);

  const cartTotal = cart.items.reduce((total, item: any) => {
    return total + (item.productPrice || 0) * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="s-shoping-cart tf-sp-2 bg-light min-vh-100 py-5">
      <div className="container">
        {/* Breadcrumb / Stepper */}
        <div className="d-flex justify-content-center mb-5">
          <div className="d-flex align-items-center gap-2 text-primary fw-bold">
            <span className="badge bg-primary rounded-circle p-2">1</span>
            <span>Carrito</span>
          </div>
          <div className="mx-3 text-muted">/</div>
          <div className="d-flex align-items-center gap-2 text-muted">
            <span className="badge bg-light text-secondary border rounded-circle p-2">
              2
            </span>
            <span>Pago</span>
          </div>
        </div>

        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="card-header bg-white p-4 border-0">
                <h4 className="fw-bold mb-0">
                  Mi Carrito ({cart.items.length})
                </h4>
              </div>

              <div className="card-body p-0">
                {cart.items.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {cart.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="list-group-item p-4 border-light d-flex gap-4 align-items-center flex-column flex-sm-row hover-bg-light transition-all"
                      >
                        {/* Image */}
                        <div
                          className="flex-shrink-0"
                          style={{
                            width: "100px",
                            height: "100px",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={
                              item.productImage ||
                              "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop"
                            }
                            alt={item.productTitle || "Product"}
                            fill
                            className="object-fit-cover rounded-3"
                            sizes="100px"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-grow-1 w-100">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="fw-bold mb-1 text-dark">
                                <Link
                                  href={`/product/${item.productId}`}
                                  className="text-decoration-none text-dark hover-text-primary"
                                >
                                  {item.productTitle}
                                </Link>
                              </h6>
                              <p className="text-muted small mb-0">
                                Ref: {item.productId.substring(0, 6)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeCartItem(item.id)}
                              className="btn btn-link text-danger p-0 text-decoration-none"
                              title="Eliminar"
                            >
                              <i className="icon-trash-2 fs-5"></i>
                            </button>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            {/* Quantity Control */}
                            <div className="d-flex align-items-center border rounded-pill bg-white px-2 py-1 shadow-sm fs-0-9">
                              <button
                                className="btn btn-sm btn-link text-dark text-decoration-none p-1"
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <i className="icon-minus"></i>
                              </button>
                              <span
                                className="mx-2 fw-semibold"
                                style={{
                                  minWidth: "20px",
                                  textAlign: "center",
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                className="btn btn-sm btn-link text-dark text-decoration-none p-1"
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <i className="icon-plus"></i>
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-end">
                              <div className="fw-bold text-dark fs-5">
                                {formatCurrency(
                                  (item.productPrice || 0) * item.quantity,
                                )}
                              </div>
                              <div className="text-muted small">
                                {formatCurrency(item.productPrice || 0)} / unid.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3 bg-light rounded-circle d-inline-flex mx-auto p-4 text-muted">
                      <i className="icon-shopping-cart fs-1"></i>
                    </div>
                    <h5 className="fw-bold">Tu carrito está vacío</h5>
                    <p className="text-muted mb-4">
                      ¡Explora el mercado y encuentra tesoros únicos!
                    </p>
                    <Link
                      href="/product-grid"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                    >
                      Explorar Productos
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Side & Summary */}
          {cart.items.length > 0 && (
            <div className="col-lg-4">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 sticky-top"
                style={{
                  top: "20px",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h5 className="fw-bold mb-4">Resumen del Pedido</h5>

                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-muted">
                  <span>Envío estimado</span>
                  <span className="text-success fw-medium">Gratis</span>{" "}
                  {/* Placeholder logic */}
                </div>

                <hr className="my-2 border-light" />

                <div className="d-flex justify-content-between mb-4 pt-2">
                  <span className="fw-bold fs-5 text-dark">Total</span>
                  <span className="fw-bold fs-4 text-primary">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-lg mb-3 d-flex justify-content-between align-items-center px-4"
                >
                  <span>Pagar Ahora</span>
                  <i className="icon-arrow-right"></i>
                </Link>

                <Link
                  href="/product-grid"
                  className="btn btn-outline-secondary w-100 rounded-pill py-2 fw-medium border-0 bg-light text-dark"
                >
                  Continuar comprando
                </Link>

                <div className="mt-4 pt-3 border-top border-light text-center">
                  <div className="d-flex justify-content-center gap-3 opacity-50 grayscale-hover">
                    <i className="icon-credit-card fs-4"></i>
                    <i className="icon-lock fs-4"></i>
                    <i className="icon-shield fs-4"></i>
                  </div>
                  <p className="text-muted mt-2 small">Pagos 100% Seguros</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .fs-0-9 {
          font-size: 0.9rem;
        }
        .hover-text-primary:hover {
          color: var(--primary) !important;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .grayscale-hover {
          filter: grayscale(1);
          transition: 0.3s;
        }
        .grayscale-hover:hover {
          filter: grayscale(0);
        }
      `}</style>
    </div>
  );
}
