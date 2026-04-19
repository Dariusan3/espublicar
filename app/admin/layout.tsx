"use client";
import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header1 />
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
      <Footer1 />
    </>
  );
}
