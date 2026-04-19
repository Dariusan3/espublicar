"use client";
import React from "react";
import { SellerProfile } from "@/hooks/useSeller";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  const stars = [];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<i key={i} className="icon-star text-warning"></i>);
    } else if (i === full && hasHalf) {
      stars.push(<i key={i} className="icon-star text-warning opacity-50"></i>);
    } else {
      stars.push(<i key={i} className="icon-star text-muted opacity-25"></i>);
    }
  }
  return stars;
}

export default function SellerProfileCard({
  profile,
}: {
  profile: SellerProfile;
}) {
  const { user, totalListings, averageRating, totalReviews, joinedDate } =
    profile;

  return (
    <div
      className="seller-profile-card p-4 rounded-4 mb-4"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
          style={{ width: "70px", height: "70px", fontSize: "1.8rem" }}
        >
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h4 className="mb-1 fw-bold">{user.name || "Usuario"}</h4>
          <p className="text-muted mb-0 small">
            <i className="icon-calendar me-1"></i>
            Miembro desde {formatDate(joinedDate)}
          </p>
          {user.city && (
            <p className="text-muted mb-0 small">
              <i className="icon-map-pin me-1"></i>
              {user.city}
              {user.country ? `, ${user.country}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-4 text-center">
          <div
            className="p-3 rounded-3"
            style={{ background: "rgba(var(--primary-rgb, 0,0,0), 0.05)" }}
          >
            <h5 className="mb-0 fw-bold text-primary">{totalListings}</h5>
            <small className="text-muted">Anuncios</small>
          </div>
        </div>
        <div className="col-4 text-center">
          <div
            className="p-3 rounded-3"
            style={{ background: "rgba(var(--primary-rgb, 0,0,0), 0.05)" }}
          >
            <h5 className="mb-0 fw-bold text-primary">
              {averageRating > 0 ? averageRating.toFixed(1) : "—"}
            </h5>
            <small className="text-muted">Valoración</small>
          </div>
        </div>
        <div className="col-4 text-center">
          <div
            className="p-3 rounded-3"
            style={{ background: "rgba(var(--primary-rgb, 0,0,0), 0.05)" }}
          >
            <h5 className="mb-0 fw-bold text-primary">{totalReviews}</h5>
            <small className="text-muted">Opiniones</small>
          </div>
        </div>
      </div>

      {averageRating > 0 && (
        <div className="mt-3 d-flex align-items-center gap-2">
          {renderStars(averageRating)}
          <span className="text-muted small">
            ({averageRating.toFixed(1)} de {totalReviews} opiniones)
          </span>
        </div>
      )}
    </div>
  );
}
