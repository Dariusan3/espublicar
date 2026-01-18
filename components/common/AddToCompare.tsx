"use client";

import { useContextElement } from "@/context/Context";

export default function AddToCompare({ productId, tooltipClass = "" } : {productId: number, tooltipClass?: string}) {
  const { addToCompareItem, isAddedtoCompareItem } = useContextElement();
  return (
    <a
      href="#compare"
      data-bs-toggle="offcanvas"
      onClick={() => addToCompareItem(productId)}
      className={`box-icon btn-icon-action hover-tooltip ${tooltipClass}`}
    >
      <span className="icon icon-compare1" />
      <span className="tooltip">
        {" "}
        {isAddedtoCompareItem(productId) ? "Compared" : "Compare"}
      </span>
    </a>
  );
}
