"use client";
import React, { useState } from "react";
import Slider1 from "./sliders/Slider1";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import MakeOfferModal from "@/components/modals/MakeOfferModal";
export default function Details1({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const { addProductToCart, isAddedToCartProducts } = useContextElement();
  const { user } = useAuth();
  const { startConversation } = useChat();
  const router = useRouter();

  const handleContactSeller = async () => {
    if (!user) {
      toast.error("Por favor, inicia sesión para contactar al vendedor");
      return;
    }

    if (user.$id === product.userId) {
      toast.warning("Este es tu propio producto");
      return;
    }

    try {
      const result = await startConversation(
        user.$id,
        product.userId,
        (product as any).$id || product.id,
      );
      if (result.success) {
        router.push(`/my-account-messages?conversationId=${result.data.id}`);
      } else {
        toast.error("Error al iniciar la conversación");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    }
  };
  return (
    <section>
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              {/* Product Image */}
              <div className="tf-product-media-wrap thumbs-default sticky-top">
                <div className="thumbs-slider">
                  <Slider1
                    firstIamge={product.imgSrc}
                    images={
                      product.thumbImages && product.thumbImages.length > 0
                        ? product.thumbImages
                        : undefined
                    }
                  />
                </div>
              </div>
              {/* /Product Image */}
            </div>
            <div className="col-md-6">
              {/* Product Infor */}
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom flex-xxl-nowrap">
                  <div className="tf-product-info-content">
                    <div className="infor-heading">
                      <p className="caption d-flex align-items-center gap-3">
                        <span>Categoría:</span>
                        <Link
                          href={`/shop-default?category=${product.category}`}
                          className="link text-secondary fw-medium"
                        >
                          {product.category || "General"}
                        </Link>
                      </p>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {product.condition && (
                          <span className="badge bg-primary-subtle text-primary rounded-pill px-3">
                            {product.condition}
                          </span>
                        )}
                        {product.location && (
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <i className="icon-map-pin"></i>
                            {product.location}
                          </span>
                        )}
                      </div>
                      <h5 className="product-info-name fw-semibold">
                        {product.title}
                      </h5>
                      <ul className="product-info-rate-wrap">
                        <li className="star-review">
                          <ul className="list-star">
                            {[...Array(5)].map((_, i) => (
                              <li key={i}>
                                <i
                                  className={`icon-star ${i >= Math.round(product.rating || 0) ? "text-main-4" : ""}`}
                                />
                              </li>
                            ))}
                          </ul>
                          <p className="caption text-main-2">
                            {product.rating?.toFixed(1) || "0"} / 5
                          </p>
                        </li>
                        {product.sold > 0 && (
                          <li>
                            <p className="caption text-main-2">
                              Vendidos: {product.sold}
                            </p>
                          </li>
                        )}
                        <li className="d-flex">
                          <Link
                            href="/shop-default"
                            className="caption text-secondary link"
                          >
                            Ver tienda
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="infor-center">
                      <div className="product-info-price">
                        <h4 className="text-primary">
                          €{product.price.toFixed(2)}
                        </h4>{" "}
                        {product.oldprice && (
                          <span className="price-text text-main-2 old-price">
                            €{product.oldprice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <ul className="product-fearture-list">
                        {product.category && (
                          <li>
                            <p className="body-md-2 fw-semibold">Categoría</p>
                            <span className="body-text-3">{product.category}</span>
                          </li>
                        )}
                        {product.condition && (
                          <li>
                            <p className="body-md-2 fw-semibold">Estado</p>
                            <span className="body-text-3">{product.condition}</span>
                          </li>
                        )}
                        {product.location && (
                          <li>
                            <p className="body-md-2 fw-semibold">Ubicación</p>
                            <span className="body-text-3">{product.location}</span>
                          </li>
                        )}
                        <li>
                          <p className="body-md-2 fw-semibold">Disponibilidad</p>
                          <span className="body-text-3">
                            {product.inStock ? "En stock" : "Agotado"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    {product.description && (
                      <div className="infor-bottom">
                        <h6 className="fw-semibold">Descripción</h6>
                        <p className="body-text-3">{product.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="tf-product-info-choose-option sticky-top">
                    <div className="product-delivery">
                      <p className="price-text fw-medium text-primary">
                        €{product.price.toFixed(2)}
                      </p>
                      <p>
                        <i className="icon-delivery-2" /> Envío disponible
                      </p>
                      {product.location && (
                        <div className="shipping-to">
                          <p className="body-md-2">
                            <i className="icon-map-pin me-1"></i>
                            {product.location}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="product-quantity">
                      <p className="title body-text-3">Cantidad</p>
                      <div className="wg-quantity">
                        <button
                          className="btn-quantity btn-decrease"
                          onClick={() =>
                            setQuantity((pre) => (pre == 1 ? 1 : pre - 1))
                          }
                        >
                          <i className="icon-minus" />
                        </button>
                        <input
                          className="quantity-product"
                          type="text"
                          readOnly
                          value={quantity}
                        />
                        <button
                          className="btn-quantity btn-increase"
                          onClick={() => setQuantity((pre) => pre + 1)}
                        >
                          <i className="icon-plus" />
                        </button>
                      </div>
                    </div>
                    <div className="product-box-btn">
                      <a
                        href="#shoppingCart"
                        data-bs-toggle="offcanvas"
                        className="tf-btn text-white"
                        onClick={() => addProductToCart(product.id, quantity)}
                      >
                        {isAddedToCartProducts(product.id)
                          ? "Ya en el carrito"
                          : "Añadir al carrito"}
                        <i className="icon-cart-2" />
                      </a>
                      <Link
                        href={`/shop-cart`}
                        className="tf-btn text-white btn-outline-primary"
                        style={{
                          background: "transparent",
                          color: "var(--primary)",
                          borderColor: "var(--primary)",
                        }}
                      >
                        Comprar ahora
                      </Link>
                      {product.isNegotiable &&
                        user &&
                        user.$id !== product.userId && (
                          <button
                            className="tf-btn btn-success text-white w-100 mt-2"
                            onClick={() => setShowOfferModal(true)}
                          >
                            <i className="icon-message-square me-2"></i>
                            Hacer una oferta
                          </button>
                        )}
                      {user?.$id !== product.userId && (
                        <button
                          className="tf-btn btn-outline-dark w-100 mt-2 rounded-pill"
                          onClick={handleContactSeller}
                        >
                          <i className="icon-message-circle me-2"></i>
                          Contactar Vendedor
                        </button>
                      )}
                      {product.userId && (
                        <Link
                          href={`/seller/${product.userId}`}
                          className="tf-btn btn-outline-secondary w-100 mt-2 rounded-pill text-center"
                        >
                          <i className="icon-user me-2"></i>
                          Ver perfil del vendedor
                        </Link>
                      )}
                    </div>
                    <div className="product-detail">
                      <p className="caption">Detalles</p>
                      <p className="body-text-3">
                        <span>
                          Devoluciones: Aceptamos devoluciones dentro de los 30
                          días posteriores a la recepción.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Product Infor */}
            </div>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <MakeOfferModal
          productId={(product as any).$id || product.id}
          sellerId={product.userId}
          currentPrice={product.price}
          productTitle={product.title}
          onClose={() => setShowOfferModal(false)}
        />
      )}
    </section>
  );
}
