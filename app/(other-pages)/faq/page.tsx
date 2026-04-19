"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";

type FAQ = { q: string; a: React.ReactNode };

const FAQS: { category: string; items: FAQ[] }[] = [
  {
    category: "Publicar",
    items: [
      {
        q: "¿Cuánto cuesta publicar un anuncio?",
        a: (
          <p>
            Publicar es <strong>siempre gratis</strong>. No cobramos por
            subir anuncios ni por mantenerlos activos. Sólo aplicamos una
            pequeña comisión del 3% al comprador cuando se cierra una venta.
          </p>
        ),
      },
      {
        q: "¿Cuánto tardo en publicar un artículo?",
        a: (
          <p>
            Menos de un minuto. Sube tus fotos, añade título, categoría,
            estado y precio, y listo. Puedes hacerlo desde móvil o escritorio
            desde{" "}
            <Link href="/add-product">Publicar</Link>.
          </p>
        ),
      },
      {
        q: "¿Cuántas fotos puedo subir?",
        a: (
          <p>
            Hasta 12 fotos por anuncio. La primera será la foto principal
            (portada). Puedes reordenarlas tocando &ldquo;Hacer portada&rdquo;
            en cualquier foto.
          </p>
        ),
      },
      {
        q: "¿Puedo editar un anuncio después de publicarlo?",
        a: (
          <p>
            Sí, ve a <Link href="/my-account-listings">Mis anuncios</Link>,
            selecciona el anuncio y pulsa &ldquo;Editar&rdquo;. Puedes cambiar
            precio, descripción, fotos o pausarlo.
          </p>
        ),
      },
    ],
  },
  {
    category: "Comprar",
    items: [
      {
        q: "¿Cómo funciona el pago seguro?",
        a: (
          <p>
            Cuando pagas un artículo, <strong>el dinero queda retenido</strong>{" "}
            por espublicar hasta que confirmes que lo has recibido y coincide
            con la descripción. Sólo entonces se libera al vendedor.
          </p>
        ),
      },
      {
        q: "¿Qué métodos de pago aceptáis?",
        a: (
          <p>
            Aceptamos <strong>Bizum</strong>, tarjeta de crédito/débito
            (Visa, Mastercard) y PayPal.
          </p>
        ),
      },
      {
        q: "¿Qué hago si el producto no llega o no es como se describe?",
        a: (
          <p>
            Tienes 48 horas desde la entrega para abrir una disputa desde{" "}
            <Link href="/my-account-orders">Mis pedidos</Link>. Si procede,
            te reembolsamos íntegramente el importe.
          </p>
        ),
      },
      {
        q: "¿Puedo hacer una oferta por un artículo?",
        a: (
          <p>
            Sí, si el vendedor marca su anuncio como &ldquo;Negociable&rdquo;,
            aparecerá el botón <strong>Hacer una oferta</strong>. El vendedor
            puede aceptarla, rechazarla o hacer una contraoferta.
          </p>
        ),
      },
    ],
  },
  {
    category: "Envíos",
    items: [
      {
        q: "¿Quién paga el envío?",
        a: (
          <p>
            El vendedor elige entre: envío con espublicar (con seguimiento) a
            coste del comprador, recogida en mano gratis, o ambas opciones.
            Verás el coste exacto antes de pagar.
          </p>
        ),
      },
      {
        q: "¿Cuánto tarda en llegar?",
        a: (
          <p>
            Entre 2 y 3 días laborables en la península. El vendedor tiene 48
            horas para enviar tras recibir el pago.
          </p>
        ),
      },
      {
        q: "¿Puedo devolver un producto?",
        a: (
          <p>
            Si el producto no coincide con la descripción, sí. Si cambias de
            opinión, depende del vendedor &mdash; contacta con él por el chat
            del anuncio.
          </p>
        ),
      },
    ],
  },
  {
    category: "Mi cuenta",
    items: [
      {
        q: "¿Cómo cambio mi contraseña?",
        a: (
          <p>
            Ve a <Link href="/my-account-edit">Configuración</Link> y usa el
            formulario de cambio de contraseña. Si la has olvidado,{" "}
            <Link href="/forgot-password">recupérala aquí</Link>.
          </p>
        ),
      },
      {
        q: "¿Cómo elimino mi cuenta?",
        a: (
          <p>
            Desde Configuración, al final de la página, encontrarás la opción
            &ldquo;Eliminar cuenta&rdquo;. Borraremos tus datos de acuerdo con
            nuestra{" "}
            <Link href="/privacy">política de privacidad</Link>.
          </p>
        ),
      },
      {
        q: "¿Por qué no recibo notificaciones?",
        a: (
          <p>
            Comprueba que has aceptado las notificaciones del navegador y que
            tu correo no está en la carpeta de spam. Las notificaciones del
            chat están activas por defecto.
          </p>
        ),
      },
    ],
  },
];

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const categories = ["Todos", ...FAQS.map((g) => g.category)];
  const visible =
    activeCategory === "Todos"
      ? FAQS
      : FAQS.filter((g) => g.category === activeCategory);

  return (
    <>
      <Header1 />
      <section className="legal-v2">
        <div className="legal-v2-container">
          <nav className="pd-v2-breadcrumb" aria-label="Navegación" style={{ marginBottom: "var(--space-6)" }}>
            <Link href="/">Inicio</Link>
            <span className="pd-v2-breadcrumb-sep">›</span>
            <span>Preguntas frecuentes</span>
          </nav>

          <header className="legal-v2-header">
            <span className="legal-v2-eyebrow">Centro de ayuda</span>
            <h1 className="legal-v2-title">¿En qué podemos ayudarte?</h1>
            <p className="legal-v2-lead">
              Las preguntas más habituales sobre publicar, comprar, pagos y
              envíos. ¿No encuentras lo que buscas?{" "}
              <Link href="/contact">Escríbenos</Link>.
            </p>
          </header>

          <div className="faq-v2-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {visible.map((group) => (
            <div key={group.category} style={{ marginBottom: "var(--space-6)" }}>
              {activeCategory === "Todos" && (
                <h2
                  className="legal-v2-section-title"
                  style={{ marginBottom: "var(--space-4)" }}
                >
                  {group.category}
                </h2>
              )}
              <div className="faq-v2-list">
                {group.items.map((item, i) => (
                  <details key={i} className="faq-v2-item">
                    <summary className="faq-v2-summary">
                      {item.q}
                      <span className="faq-v2-chevron">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </summary>
                    <div className="faq-v2-content">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer1 />
    </>
  );
}
