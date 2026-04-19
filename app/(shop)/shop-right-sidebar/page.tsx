import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Products2 from "@/components/products/Products2";

export const metadata = {
  title: "Tienda | espublicar",
  description: "Explora artículos con filtros laterales",
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
            <span>Tienda</span>
          </nav>
        </div>
      </div>
      <Products2 />
      <Footer1 />
    </>
  );
}
