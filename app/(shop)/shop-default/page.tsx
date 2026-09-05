import React from "react";
import Link from "next/link";
import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";
import ShopResults from "@/components/shop/ShopResults";
import BackLink from "@/components/common/BackLink";

export const metadata = {
  title: "Tienda | espublicar",
  description: "Explora artículos de segunda mano cerca de ti.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="pd-v2" style={{ paddingBottom: 0 }}>
        <div className="pd-v2-container">
          <BackLink />
        </div>
      </div>
      <ShopResults />
      <SiteFooter />
    </>
  );
}
