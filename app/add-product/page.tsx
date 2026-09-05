import AddProduct from "@/components/dashboard/AddProduct";
import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import React from "react";

export const metadata = {
  title: "Publicar anuncio | espublicar",
  description: "Publica tu anuncio en menos de un minuto, gratis.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="publicar-v2-page">
        <AddProduct />
      </main>
      <SiteFooter />
    </>
  );
}
