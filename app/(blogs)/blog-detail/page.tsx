import BlogDetails from "@/components/blogs/BlogDetails";
import RecentProducts from "@/components/common/RecentProducts";
import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Blog Details || Onsus - Multipurpose React Nextjs eCommerce",
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
              <span className="body-small">Blog Details</span>
            </li>
          </ul>
        </div>
      </div>
      <BlogDetails />
      <RecentProducts />

      <SiteFooter />
    </>
  );
}
