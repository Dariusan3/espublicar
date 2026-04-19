"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import SellerProfileCard from "@/components/seller/SellerProfileCard";
import SellerListings from "@/components/seller/SellerListings";
import useSeller, { SellerProfile } from "@/hooks/useSeller";
import Link from "next/link";

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params?.id ? String(params.id) : "";
  const { getSellerProfile, loading } = useSeller();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sellerId) return;
    const load = async () => {
      const result = await getSellerProfile(sellerId);
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(true);
      }
    };
    load();
  }, [sellerId, getSellerProfile]);

  return (
    <>
      <Header1 />
      <div className="tf-sp-1">
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
              <span className="body-small">Perfil del vendedor</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          {loading && !profile && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-5">
              <i className="icon-alert-circle fs-1 text-danger mb-3 d-block"></i>
              <h5>Vendedor no encontrado</h5>
              <p className="text-muted">
                Este perfil no existe o ha sido eliminado.
              </p>
              <Link href="/shop-default" className="btn btn-primary rounded-pill">
                Volver a la tienda
              </Link>
            </div>
          )}

          {profile && (
            <div className="row">
              <div className="col-lg-4">
                <SellerProfileCard profile={profile} />
              </div>
              <div className="col-lg-8">
                <SellerListings listings={profile.listings} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer1 />
    </>
  );
}
