"use client";

import useCart from "@/hooks/useCart";

export default function AddToCart({
  productId,
  tooltipClass = "",
}: {
  productId: number | string;
  tooltipClass?: string;
}) {
  const { addCartItem, cart } = useCart();

  // Convert productId to string for consistency with Appwrite
  const productIdStr = String(productId);

  // Check if product is already in cart
  const isInCart = cart.items.some((item) => item.productId === productIdStr);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addCartItem(productIdStr, 1);
  };

  return (
    <>
      <a
        href="#shoppingCart"
        data-bs-toggle="offcanvas"
        onClick={handleAddToCart}
        className={`box-icon add-to-cart btn-icon-action hover-tooltip ${tooltipClass}`}
      >
        <span className="icon icon-cart2" />
        <span className="tooltip">
          {isInCart ? "Already Added" : "Add to Cart"}
        </span>
      </a>
    </>
  );
}
