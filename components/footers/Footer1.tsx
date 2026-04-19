"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer1() {
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-v2-col-heading");

    const toggleOpen = (event: any) => {
      const parent = event.currentTarget.closest(".footer-v2-col");
      if (!parent) return;
      const content = parent.querySelector(
        ".footer-v2-col-content",
      ) as HTMLElement;
      if (!content) return;

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []);

  return (
    <footer className="footer-v2">
      <div className="footer-v2-container">
        <div className="footer-v2-grid">
          {/* Brand column */}
          <div className="footer-v2-brand">
            <Link href="/" className="footer-v2-logo">
              <Image
                alt="espublicar"
                src="/images/logo/logo.svg"
                width={160}
                height={36}
              />
            </Link>
            <p className="footer-v2-pitch">
              El marketplace para vender y comprar de segunda mano cerca de ti,
              con pago seguro.
            </p>
            <div className="footer-v2-stores">
              <a
                href="#"
                className="footer-v2-store-badge"
                aria-label="Descargar en App Store"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </a>
              <a
                href="#"
                className="footer-v2-store-badge"
                aria-label="Descargar en Google Play"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 20.5V3.5c0-.4.2-.7.5-.9l10.2 9.4L3.5 21.4c-.3-.2-.5-.5-.5-.9zm12.1-8l-2.5 2.3 2.5 2.3 3.3-1.9c.6-.4.6-1 0-1.4l-3.3-1.3zm-1 1.1L4.4 22l9.9-5.4-.2-1.5-.1-1.5zm0-2.2l.1-1.5.2-1.5L4.4 3l9.7 8.4z" />
                </svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Empresa */}
          <div className="footer-v2-col">
            <h6 className="footer-v2-col-heading">Empresa</h6>
            <div className="footer-v2-col-content">
              <ul className="footer-v2-links">
                <li>
                  <Link href="/about">Sobre nosotros</Link>
                </li>
                <li>
                  <Link href="/faq">Cómo funciona</Link>
                </li>
                <li>
                  <Link href="#">Trabaja con nosotros</Link>
                </li>
                <li>
                  <Link href="#">Prensa</Link>
                </li>
                <li>
                  <Link href="/blog-grid">Blog</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Ayuda */}
          <div className="footer-v2-col">
            <h6 className="footer-v2-col-heading">Ayuda</h6>
            <div className="footer-v2-col-content">
              <ul className="footer-v2-links">
                <li>
                  <Link href="/faq">Centro de ayuda</Link>
                </li>
                <li>
                  <Link href="/contact">Contacto</Link>
                </li>
                <li>
                  <Link href="/privacy">Confianza y seguridad</Link>
                </li>
                <li>
                  <Link href="/privacy">Envíos y pagos</Link>
                </li>
                <li>
                  <Link href="/privacy">Reembolsos</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Comunidad */}
          <div className="footer-v2-col">
            <h6 className="footer-v2-col-heading">Comunidad</h6>
            <div className="footer-v2-col-content">
              <ul className="footer-v2-links">
                <li>
                  <Link href="#">Comunidad espublicar</Link>
                </li>
                <li>
                  <Link href="#">Programa Pro</Link>
                </li>
                <li>
                  <Link href="#">Invita a un amigo</Link>
                </li>
                <li>
                  <Link href="#">Eventos</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-v2-bottom">
          <div className="footer-v2-bottom-left">
            <span>© 2026 espublicar · Todos los derechos reservados</span>
            <span className="footer-v2-legal">
              <Link href="/privacy">Privacidad</Link>
              <span className="footer-v2-dot">·</span>
              <Link href="/privacy">Términos</Link>
              <span className="footer-v2-dot">·</span>
              <Link href="/privacy">Cookies</Link>
            </span>
          </div>
          <div className="footer-v2-payments" aria-label="Métodos de pago">
            <span className="footer-v2-payment-chip">Visa</span>
            <span className="footer-v2-payment-chip">Mastercard</span>
            <span className="footer-v2-payment-chip">Bizum</span>
            <span className="footer-v2-payment-chip">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
