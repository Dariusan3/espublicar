import AddProduct from "@/components/dashboard/AddProduct";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

export const metadata = {
  title: "Publicar anuncio | espublicar",
  description: "Publica tu anuncio en menos de un minuto, gratis.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <main className="publicar-v2-page">
        <AddProduct />
      </main>
      <Footer1 />
    </>
  );
}
