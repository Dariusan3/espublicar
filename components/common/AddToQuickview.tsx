"use client";

import { useContextElement } from "@/context/Context";
import { allProducts } from "@/data/products";

export default function AddToQuickview({
  productId,
  product,
  tooltipClass = "",
}: {
  productId: string | number;
  /** Real listing. Template pages still pass nothing and fall back to demo data. */
  product?: any;
  tooltipClass?: string;
}) {
  const item =
    product ??
    allProducts.filter((elm) => elm.id == productId)[0] ??
    allProducts[0];
  const { setQuickViewItem } = useContextElement();
  return (
    <a
      href="#quickView"
      data-bs-toggle="modal"
      onClick={() => setQuickViewItem(item)}
      className={`box-icon quickview btn-icon-action hover-tooltip ${tooltipClass}`}
      aria-label="Vista rápida"
    >
      <span className="icon icon-view" />
      <span className="tooltip">Vista rápida</span>
    </a>
  );
}
