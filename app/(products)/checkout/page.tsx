import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import Checkout from "@/components/shop-cart/Checkout";
import React from "react";

export const metadata = {
  title: "Completa tu compra | espublicar",
  description: "Reserva tu artículo con pago seguro.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <Checkout />
      <SiteFooter />
    </>
  );
}
