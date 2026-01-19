"use client";

import useWishlist from "@/hooks/useWishlist";

export default function AddToWishlist({
  productId,
  tooltipClass = "",
}: {
  productId: number | string;
  tooltipClass?: string;
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Convert productId to string for consistency with Appwrite
  const productIdStr = String(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(productIdStr);
  };

  const inWishlist = isInWishlist(productIdStr);

  return (
    <a
      href="#"
      onClick={handleToggleWishlist}
      className={`box-icon btn-icon-action hover-tooltip ${tooltipClass}`}
    >
      <span className={`icon ${inWishlist ? "icon-trash" : "icon-heart2"}`} />
      <span className="tooltip">
        {inWishlist ? "Remove Wishlist" : "Add to Wishlist"}
      </span>
    </a>
  );
}
