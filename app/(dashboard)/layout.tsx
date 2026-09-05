import React from "react";
import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";
import Sidebar from "@/components/dashboard/Sidebar";
import RequireSession from "@/components/dashboard/RequireSession";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="dashboard-v2-layout">
        <div className="dashboard-v2-container">
          <div className="dashboard-v2-grid">
            <div className="dashboard-v2-sidebar-wrap">
              <Sidebar />
            </div>
            <div className="dashboard-v2-content-wrap">
              <RequireSession>{children}</RequireSession>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
