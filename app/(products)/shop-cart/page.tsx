import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import ShopCart from "@/components/shop-cart/ShopCart";
import BackLink from "@/components/common/BackLink";
import React from "react";

export const metadata = {
  title: "Carrito | espublicar",
  description: "Revisa los artículos que vas a comprar antes de pagar.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <div className="pd-v2" style={{ paddingBottom: 0 }}>
        <div className="pd-v2-container">
          <BackLink fallback="/shop-default" label="Seguir comprando" />
        </div>
      </div>
      <ShopCart />
      <Footer1 />
    </>
  );
}
