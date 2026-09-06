"use client";
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";
import { useAuth } from "@/context/AuthContext";
import { db, DB_ID, COLLECTIONS } from "@/lib/supabase";
import { EmptyState } from "@/components/common/Skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  // null while we are still asking the database what this account is allowed to do.
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    // The role lives on the profile row, which RLS only lets you read for
    // yourself — so this answer cannot be spoofed from the client.
    db.getDocument(DB_ID, COLLECTIONS.USERS, user.$id)
      .then((profile: any) => {
        if (!cancelled) setIsAdmin(profile?.role === "admin");
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  if (loading || isAdmin === null) {
    return (
      <>
        <SiteHeader />
        <section className="flat-spacing-11">
          <div className="container" style={{ minHeight: "40vh" }} />
        </section>
        <SiteFooter />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <SiteHeader />
        <section className="flat-spacing-11">
          <div className="container">
            <EmptyState
              illustration="package"
              title="Esta zona es solo para administradores"
              description="Si crees que deberías tener acceso, pide que activen tu cuenta."
              action={{ label: "Volver a la tienda", href: "/" }}
            />
          </div>
        </section>
        <SiteFooter />
      </>
    );
  }

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
