"use client";

import useCart from "@/hooks/useCart";
import useAuthGate from "@/hooks/useAuthGate";

export default function AddToCart({
  productId,
  tooltipClass = "",
}: {
  productId: number | string;
  tooltipClass?: string;
}) {
  const { addCartItem, cart } = useCart();
  const { requireAuth } = useAuthGate();

  // Convert productId to string for consistency with Appwrite
  const productIdStr = String(productId);

  // Check if product is already in cart
  const isInCart = cart.items.some((item) => item.productId === productIdStr);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!requireAuth("Inicia sesión para añadir al carrito")) return;

    const result = await addCartItem(productIdStr, 1);
    if (!result.success) return;

    // Opened here rather than with data-bs-toggle, which fires on every click
    // — including the ones that end at the login prompt.
    const panel = document.getElementById("shoppingCart");
    if (panel) {
      const bootstrap = require("bootstrap");
      bootstrap.Offcanvas.getOrCreateInstance(panel).show();
    }
  };

  return (
    <>
      <a
        href="#shoppingCart"
        onClick={handleAddToCart}
        className={`box-icon add-to-cart btn-icon-action hover-tooltip ${tooltipClass}`}
      >
        <span className="icon icon-cart2" />
        <span className="tooltip">
          {isInCart ? "Ya en el carrito" : "Añadir al carrito"}
        </span>
      </a>
    </>
  );
}
