"use client";
import React from "react";
import { Product } from "@/types/Types";
import Link from "next/link";
import Image from "next/image";

export default function SellerListings({
  listings,
}: {
  listings: Product[];
}) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="icon-package fs-1 text-muted mb-3 d-block"></i>
        <p className="text-muted">Este vendedor aún no tiene anuncios.</p>
      </div>
    );
  }

  return (
    <div>
      <h5 className="fw-bold mb-4">
        Anuncios ({listings.length})
      </h5>
      <div className="row g-3">
        {listings.map((product) => (
          <div key={String(product.id)} className="col-6 col-md-4 col-lg-3">
            <Link
              href={`/product/${product.id}`}
              className="text-decoration-none"
            >
              <div
                className="card border-0 h-100 rounded-3 overflow-hidden shadow-sm hover-shadow transition-all"
                style={{ transition: "all 0.2s ease" }}
              >
                <div
                  className="position-relative"
                  style={{ paddingTop: "100%" }}
                >
                  <Image
                    src={product.imgSrc}
                    alt={product.title}
                    fill
                    className="object-fit-cover"
                  />
                  {product.condition && (
                    <span className="position-absolute top-0 start-0 badge bg-primary-subtle text-primary m-2 rounded-pill">
                      {product.condition}
                    </span>
                  )}
                </div>
                <div className="card-body p-3">
                  <h6 className="card-title text-dark mb-1 text-truncate fw-semibold">
                    {product.title}
                  </h6>
                  <p className="text-primary fw-bold mb-1">
                    €{product.price.toFixed(2)}
                  </p>
                  {product.location && (
                    <small className="text-muted d-flex align-items-center gap-1">
                      <i className="icon-map-pin" style={{ fontSize: "0.7rem" }}></i>
                      {product.location}
                    </small>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
