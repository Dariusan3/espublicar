import React from "react";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header1 />
      <main className="dashboard-v2-layout">
        <div className="dashboard-v2-container">
          <div className="dashboard-v2-grid">
            <div className="dashboard-v2-sidebar-wrap">
              <Sidebar />
            </div>
            <div className="dashboard-v2-content-wrap">{children}</div>
          </div>
        </div>
      </main>
      <Footer1 />
    </>
  );
}
