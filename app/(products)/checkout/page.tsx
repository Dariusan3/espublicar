import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Checkout from "@/components/shop-cart/Checkout";
import React from "react";

export const metadata = {
  title: "Completa tu compra | espublicar",
  description: "Reserva tu artículo con pago seguro.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <Checkout />
      <Footer1 />
    </>
  );
}
