"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SUGGESTIONS = ["iPhone", "Bicicleta", "Sofá", "PS5", "Cochecito"];

const FLOATING_CARDS = [
  {
    src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop",
    title: "iPhone 13 Pro",
    price: "520 €",
    chip: "Como nuevo",
    chipClass: "chip-soft",
    location: "Madrid",
    top: "0%",
    left: "0%",
    width: "54%",
    rotate: "-4deg",
    delay: "0s",
  },
  {
    src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
    title: "Sofá 3 plazas",
    price: "180 €",
    chip: "Negociable",
    chipClass: "chip-success",
    location: "Valencia",
    top: "22%",
    right: "0%",
    width: "56%",
    rotate: "3deg",
    delay: "0.4s",
  },
  {
    src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop",
    title: "Bici urbana",
    price: "240 €",
    chip: "Muy bueno",
    chipClass: "chip-soft",
    location: "Barcelona",
    bottom: "0%",
    left: "15%",
    width: "54%",
    rotate: "-2deg",
    delay: "0.8s",
  },
];

const STATS = [
  { value: "15.000+", label: "Usuarios activos" },
  { value: "50.000+", label: "Anuncios publicados" },
  { value: "4.8★", label: "Valoración media" },
  { value: "< 24h", label: "Tiempo medio de venta" },
];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop-default?query=${encodeURIComponent(q)}` : "/shop-default");
  };

  const handleChip = (text: string) => {
    router.push(`/shop-default?query=${encodeURIComponent(text)}`);
  };

  return (
    <>
      <section className="hero-v2">
        <div className="hero-v2-container">
          <div className="hero-v2-copy">
            <span className="hero-v2-eyebrow">Marketplace de segunda mano</span>
            <h1 className="hero-v2-headline">Vende y compra cerca de ti.</h1>
            <p className="hero-v2-sub">
              Publica gratis en un minuto y paga seguro con Bizum o tarjeta.
            </p>

            <form className="hero-v2-search" onSubmit={handleSubmit}>
              <input
                type="search"
                className="input-search hero-v2-input"
                placeholder="¿Qué buscas? iPhone, sofá, bici…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar"
              />
              <button type="submit" className="btn-brand hero-v2-cta">
                Buscar
              </button>
            </form>

            <div className="hero-v2-chips">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => handleChip(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="hero-v2-trust">
              <span className="hero-v2-trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Pago seguro con Bizum
              </span>
              <span className="hero-v2-trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Envío con seguimiento
              </span>
              <span className="hero-v2-trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Reembolso garantizado
              </span>
            </div>
          </div>

          <div className="hero-v2-visual">
            {FLOATING_CARDS.map((item, i) => (
              <div
                key={i}
                className="hero-v2-floating-card"
                style={{
                  top: item.top,
                  bottom: item.bottom,
                  left: item.left,
                  right: item.right,
                  width: item.width,
                  transform: `rotate(${item.rotate})`,
                  animationDelay: item.delay,
                }}
              >
                <div
                  className="hero-v2-floating-img"
                  style={{ backgroundImage: `url(${item.src})` }}
                >
                  <span className={`chip ${item.chipClass} hero-v2-floating-chip`}>
                    {item.chip}
                  </span>
                </div>
                <div className="hero-v2-floating-body">
                  <p className="hero-v2-floating-title">{item.title}</p>
                  <div className="hero-v2-floating-meta">
                    <span className="hero-v2-floating-price num">
                      {item.price}
                    </span>
                    <span className="hero-v2-floating-loc">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Decorative blob */}
            <div className="hero-v2-blob" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="hero-v2-stats-band">
        <div className="hero-v2-stats-container">
          {STATS.map((s, i) => (
            <div key={i} className="hero-v2-stat">
              <div className="hero-v2-stat-value num">{s.value}</div>
              <div className="hero-v2-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
