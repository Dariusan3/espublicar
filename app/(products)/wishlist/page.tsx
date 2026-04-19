import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Wishlist from "@/components/shop-cart/Wishlist";

export const metadata = {
  title: "Mis favoritos | espublicar",
  description: "Tus artículos guardados en espublicar.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <div className="pd-v2" style={{ paddingBottom: 0 }}>
        <div className="pd-v2-container">
          <nav className="pd-v2-breadcrumb" aria-label="Navegación">
            <Link href="/">Inicio</Link>
            <span className="pd-v2-breadcrumb-sep">›</span>
            <span>Favoritos</span>
          </nav>
        </div>
      </div>
      <Wishlist />
      <Footer1 />
    </>
  );
}
