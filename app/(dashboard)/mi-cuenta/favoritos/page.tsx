import React from "react";
import Wishlist from "@/components/shop-cart/Wishlist";

export const metadata = {
  title: "Mis favoritos | espublicar",
  description: "Los artículos que has guardado.",
};

export default function Page() {
  return <Wishlist />;
}
