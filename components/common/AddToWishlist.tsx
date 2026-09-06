"use client";

import useWishlist from "@/hooks/useWishlist";
import useAuthGate from "@/hooks/useAuthGate";

export default function AddToWishlist({
  productId,
  tooltipClass = "",
}: {
  productId: number | string;
  tooltipClass?: string;
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { requireAuth } = useAuthGate();

  // Convert productId to string for consistency with Appwrite
  const productIdStr = String(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!requireAuth("Inicia sesión para guardar favoritos")) return;
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
        {inWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
      </span>
    </a>
  );
}
