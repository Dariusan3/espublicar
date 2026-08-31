import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Products2 from "@/components/products/Products2";
import BackLink from "@/components/common/BackLink";

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
          <BackLink />
        </div>
      </div>
      <Products2 />
      <Footer1 />
    </>
  );
}
