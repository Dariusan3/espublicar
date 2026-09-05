import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Only destinations that exist. The previous footer listed sixteen links, eight
 * of which went to "#", three legal pages that were all the privacy page, and
 * app-store badges for apps that do not exist.
 */
const COLUMNS = [
  {
    heading: "Comprar",
    links: [
      { label: "Explorar anuncios", href: "/shop-default" },
      { label: "Cómo funciona", href: "/faq" },
      { label: "Mis pedidos", href: "/mi-cuenta/pedidos" },
    ],
  },
  {
    heading: "Vender",
    links: [
      { label: "Publicar anuncio", href: "/add-product" },
      { label: "Mis anuncios", href: "/mi-cuenta/anuncios" },
      { label: "Mis ofertas", href: "/mi-cuenta/ofertas" },
    ],
  },
  {
    heading: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "/faq" },
      { label: "Contacto", href: "/contact" },
      { label: "Privacidad", href: "/privacy" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="footer-v2">
      <div className="footer-v2-container">
        <div className="footer-v2-grid">
          <div className="footer-v2-brand">
            <Link href="/" className="footer-v2-logo">
              <Image
                alt="espublicar"
                src="/images/logo/logo.svg"
                width={140}
                height={32}
              />
            </Link>
            <p className="footer-v2-pitch">
              Compra y vende de segunda mano cerca de ti, con pago protegido
              hasta que recibes el artículo.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} className="footer-v2-col">
              <h3 className="footer-v2-col-heading">{column.heading}</h3>
              <ul className="footer-v2-col-list">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-v2-bottom">
          <span>© 2026 espublicar</span>
          <span className="footer-v2-payment">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pago con tarjeta, procesado por Stripe
          </span>
        </div>
      </div>
    </footer>
  );
}
