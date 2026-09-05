import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import OrderDetails from "@/components/shop-cart/OrderDetails";
import BackLink from "@/components/common/BackLink";
import React from "react";

export const metadata = {
  title: "Detalle del pedido | espublicar",
  description: "Estado, artículos y envío de tu pedido.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="pd-v2" style={{ paddingBottom: 0 }}>
        <div className="pd-v2-container">
          <BackLink fallback="/mi-cuenta/pedidos" label="Mis pedidos" />
        </div>
      </div>
      <OrderDetails />
      <SiteFooter />
    </>
  );
}
