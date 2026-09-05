import FeatureStrip from "@/components/common/FeatureStrip";
import RecentProducts from "@/components/common/RecentProducts";
import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import OrderTraking from "@/components/shop-cart/OrderTraking";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Track Your Order || Onsus - Multipurpose React Nextjs eCommerce",
  description: "Onsus - Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <SiteHeader />
      <div className="tf-sp-3 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                {" "}
                Home{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <p className="body-small">Track Your Order</p>
            </li>
          </ul>
        </div>
      </div>

      <OrderTraking />

      <RecentProducts />
      <FeatureStrip />
      <SiteFooter />
    </>
  );
}
