import BlogList from "@/components/blogs/BlogList";
import FeatureStrip from "@/components/common/FeatureStrip";
import RecentProducts from "@/components/common/RecentProducts";
import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Blog List || Onsus - Multipurpose React Nextjs eCommerce",
  description: "Onsus - Multipurpose React Nextjs eCommerce",
};
export default function page() {
  return (
    <>
      <SiteHeader />
      <div className="tf-sp-1">
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
              <span className="body-small">Blog List</span>
            </li>
          </ul>
        </div>
      </div>
      <BlogList />
      <RecentProducts />
      <FeatureStrip />
      <SiteFooter />
    </>
  );
}
