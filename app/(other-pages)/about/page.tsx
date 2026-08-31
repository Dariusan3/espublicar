import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import BackLink from "@/components/common/BackLink";

export const metadata = {
  title: "Sobre nosotros | espublicar",
  description:
    "espublicar es el marketplace de segunda mano para vender y comprar cerca de ti con pago seguro.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <section className="legal-v2">
        <div className="legal-v2-container">
          <BackLink />

          <header className="legal-v2-header">
            <span className="legal-v2-eyebrow">Nuestra historia</span>
            <h1 className="legal-v2-title">
              Damos una segunda vida a lo que ya no usas.
            </h1>
            <p className="legal-v2-lead">
              espublicar nace en España con una idea sencilla: que comprar y
              vender de segunda mano sea tan fácil y seguro como un Bizum a un
              amigo. Sin comisiones abusivas, sin estafas, cerca de ti.
            </p>
          </header>

          <article className="legal-v2-card">
            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Por qué existimos</h2>
              <div className="legal-v2-prose">
                <p>
                  Cada año se tiran miles de toneladas de productos en
                  perfecto estado simplemente porque sus dueños no saben qué
                  hacer con ellos. A la vez, mucha gente paga precios
                  desorbitados por productos nuevos cuando la versión usada
                  sería suficiente.
                </p>
                <p>
                  Creemos que hay una solución mejor: un marketplace donde{" "}
                  <strong>publicar un anuncio tarde menos de un minuto</strong>,
                  el pago sea seguro para ambas partes y el envío llegue con
                  seguimiento.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Nuestros valores</h2>
              <div className="about-v2-values">
                <div className="about-v2-value">
                  <div className="about-v2-value-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="about-v2-value-title">Confianza</h3>
                  <p className="about-v2-value-caption">
                    Pago retenido hasta que el comprador confirma recibir el
                    artículo. Reembolso si algo va mal.
                  </p>
                </div>
                <div className="about-v2-value">
                  <div className="about-v2-value-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 className="about-v2-value-title">Rapidez</h3>
                  <p className="about-v2-value-caption">
                    Publica un anuncio en menos de 60 segundos desde el móvil.
                    Chatea y negocia al instante.
                  </p>
                </div>
                <div className="about-v2-value">
                  <div className="about-v2-value-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 22s3-7 8-7" />
                      <path d="M6 2s-3 7-3 15" />
                      <path d="M3 12h18" />
                    </svg>
                  </div>
                  <h3 className="about-v2-value-title">Cercanía</h3>
                  <p className="about-v2-value-caption">
                    Prioridad a los artículos cerca de ti. Recogida en mano o
                    envío con seguimiento, tú decides.
                  </p>
                </div>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">
                Cómo ganamos dinero
              </h2>
              <div className="legal-v2-prose">
                <p>
                  <strong>Publicar es gratis, siempre.</strong> Cobramos una
                  pequeña comisión de servicio del 3% al comprador en el
                  momento de la compra, que cubre:
                </p>
                <ul>
                  <li>Procesamiento del pago y protección antifraude.</li>
                  <li>
                    Dinero retenido hasta que el comprador confirma la entrega.
                  </li>
                  <li>Atención al cliente 7 días a la semana.</li>
                  <li>Gestión de disputas y reembolsos.</li>
                </ul>
                <p>
                  Los vendedores reciben el 100% del precio acordado. Sin
                  letra pequeña.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">
                ¿Quieres vender algo?
              </h2>
              <div className="legal-v2-prose">
                <p>
                  Crea tu cuenta gratis, publica tu primer anuncio en un
                  minuto y empieza a vender hoy mismo.
                </p>
                <p style={{ marginTop: "var(--space-5)" }}>
                  <Link href="/add-product" className="btn-brand btn-lg">
                    Publicar mi primer anuncio →
                  </Link>
                </p>
              </div>
            </section>
          </article>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
