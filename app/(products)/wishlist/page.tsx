import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Wishlist from "@/components/shop-cart/Wishlist";
import BackLink from "@/components/common/BackLink";

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
          <BackLink />
        </div>
      </div>
      <Wishlist />
      <Footer1 />
    </>
  );
}
