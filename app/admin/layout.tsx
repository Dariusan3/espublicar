"use client";
import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <AdminSidebar />
            </div>
            <div className="col-lg-9">
              <div className="my-account-content account-order">{children}</div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
