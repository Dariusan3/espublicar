import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Products1 from "@/components/products/Products1";
import BackLink from "@/components/common/BackLink";

export const metadata = {
  title: "Tienda | espublicar",
  description: "Explora artículos de segunda mano cerca de ti.",
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
      <Products1 />
      <Footer1 />
    </>
  );
}
