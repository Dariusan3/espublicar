import MyOffers from "@/components/dashboard/MyOffers";
import Sidebar from "@/components/dashboard/Sidebar";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Mis Ofertas || espublicar",
  description: "Gestiona tus ofertas enviadas y recibidas",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-1 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href="/" className="body-small link">
                Inicio
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Mis Ofertas</span>
            </li>
          </ul>
        </div>
      </div>
      <section className="tf-sp-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 d-none d-lg-block">
              <div className="wrap-sidebar-account">
                <Sidebar />
              </div>
            </div>
            <div className="col-lg-9">
              <MyOffers />
            </div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
