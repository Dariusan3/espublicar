import React from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";

export const metadata = {
  title: "Política de privacidad | espublicar",
  description:
    "Cómo recogemos, usamos y protegemos tus datos en espublicar.",
};

export default function Page() {
  return (
    <>
      <Header1 />
      <section className="legal-v2">
        <div className="legal-v2-container">
          <nav className="pd-v2-breadcrumb" aria-label="Navegación" style={{ marginBottom: "var(--space-6)" }}>
            <Link href="/">Inicio</Link>
            <span className="pd-v2-breadcrumb-sep">›</span>
            <span>Privacidad</span>
          </nav>

          <header className="legal-v2-header">
            <span className="legal-v2-eyebrow">Legal</span>
            <h1 className="legal-v2-title">Política de privacidad</h1>
            <p className="legal-v2-lead">
              En espublicar nos tomamos muy en serio la protección de tus
              datos. Aquí te explicamos qué información recopilamos, para qué
              la usamos y cuáles son tus derechos.
            </p>
            <p className="legal-v2-updated">Última actualización: enero de 2025</p>
          </header>

          <article className="legal-v2-card">
            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Quiénes somos</h2>
              <div className="legal-v2-prose">
                <p>
                  espublicar es un marketplace de segunda mano operado desde
                  España. Nuestra dirección web es:{" "}
                  <Link href="/">espublicar.com</Link>. Puedes contactarnos en{" "}
                  <a href="mailto:soporte@espublicar.com">
                    soporte@espublicar.com
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Qué datos recopilamos</h2>
              <div className="legal-v2-prose">
                <p>
                  Recogemos únicamente los datos necesarios para ofrecerte el
                  servicio. Esto incluye:
                </p>
                <ul>
                  <li>
                    <strong>Cuenta</strong>: nombre, correo electrónico y, si
                    lo añades, número de teléfono o foto de perfil.
                  </li>
                  <li>
                    <strong>Anuncios</strong>: las fotos, descripciones,
                    precios y ubicación que publiques.
                  </li>
                  <li>
                    <strong>Transacciones</strong>: dirección de envío,
                    método de pago (últimos 4 dígitos de la tarjeta o teléfono
                    Bizum enmascarado) y el historial de pedidos.
                  </li>
                  <li>
                    <strong>Mensajes</strong>: las conversaciones que
                    mantienes con otros usuarios dentro del chat.
                  </li>
                  <li>
                    <strong>Datos técnicos</strong>: dirección IP, tipo de
                    navegador, páginas visitadas y cookies (ver más abajo).
                  </li>
                </ul>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Fotos de los artículos</h2>
              <div className="legal-v2-prose">
                <p>
                  Si subes fotos de un artículo, evita incluir imágenes con
                  datos de ubicación incrustados (EXIF GPS). Cualquier
                  visitante del anuncio puede descargarlas.
                </p>
                <p>
                  Las fotos que subes pueden usarse en caso de disputa para
                  resolver reclamaciones y verificar el estado del producto.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Cookies</h2>
              <div className="legal-v2-prose">
                <p>
                  Usamos cookies estrictamente necesarias para que el sitio
                  funcione correctamente:
                </p>
                <ul>
                  <li>
                    Cookies de sesión para mantener tu inicio de sesión durante
                    48 horas (o 14 días si marcas &ldquo;Recuérdame&rdquo;).
                  </li>
                  <li>
                    Cookies de preferencias para recordar tus filtros de
                    búsqueda, idioma y moneda.
                  </li>
                  <li>
                    Cookies del carrito para guardar los artículos que estás
                    reservando.
                  </li>
                </ul>
                <p>
                  No usamos cookies publicitarias ni de rastreo entre sitios.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">
                Contenido de terceros
              </h2>
              <div className="legal-v2-prose">
                <p>
                  Algunas páginas pueden incluir contenido de terceros (mapas,
                  vídeos, pasarelas de pago). Esos servicios tienen sus
                  propias políticas de privacidad y pueden recopilar datos
                  sobre tu visita:
                </p>
                <ul>
                  <li>
                    <strong>Supabase</strong>: proveedor de nuestra
                    infraestructura (autenticación, base de datos,
                    almacenamiento).
                  </li>
                  <li>
                    <strong>Bizum, Stripe, PayPal</strong>: procesadores de
                    pago cuando realizas una compra.
                  </li>
                  <li>
                    <strong>Servicios de mensajería</strong>: para la gestión
                    de envíos con seguimiento.
                  </li>
                </ul>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">
                Con quién compartimos tus datos
              </h2>
              <div className="legal-v2-prose">
                <ul>
                  <li>
                    Con otros usuarios: tu nombre, foto y anuncios son
                    públicos. Los datos de envío se comparten sólo con el
                    vendedor de un pedido confirmado.
                  </li>
                  <li>
                    Con las empresas de envío para entregar tus compras.
                  </li>
                  <li>
                    Con los procesadores de pago para completar transacciones.
                  </li>
                  <li>
                    Con las autoridades cuando sea legalmente obligatorio.
                  </li>
                </ul>
                <p>
                  <strong>No vendemos tus datos a terceros</strong> bajo
                  ninguna circunstancia.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">
                Cuánto tiempo conservamos tus datos
              </h2>
              <div className="legal-v2-prose">
                <ul>
                  <li>
                    Los datos de tu cuenta se conservan mientras ésta esté
                    activa.
                  </li>
                  <li>
                    El historial de compras se conserva durante 6 años por
                    obligaciones fiscales.
                  </li>
                  <li>
                    Los mensajes se conservan durante 2 años para resolver
                    posibles disputas.
                  </li>
                  <li>
                    Los anuncios vendidos o eliminados se borran pasados 90
                    días.
                  </li>
                </ul>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Tus derechos</h2>
              <div className="legal-v2-prose">
                <p>
                  De acuerdo con el RGPD, tienes derecho a:
                </p>
                <ul>
                  <li>
                    <strong>Acceso</strong>: solicitar una copia de los datos
                    que tenemos sobre ti.
                  </li>
                  <li>
                    <strong>Rectificación</strong>: corregir cualquier dato
                    incorrecto o incompleto.
                  </li>
                  <li>
                    <strong>Supresión</strong>: pedirnos que borremos tus
                    datos (excepto los que debamos conservar legalmente).
                  </li>
                  <li>
                    <strong>Portabilidad</strong>: recibir tus datos en un
                    formato estructurado y transferible.
                  </li>
                  <li>
                    <strong>Oposición</strong>: oponerte al tratamiento de tus
                    datos con fines de marketing.
                  </li>
                </ul>
                <p>
                  Para ejercer cualquier derecho, escríbenos a{" "}
                  <a href="mailto:privacidad@espublicar.com">
                    privacidad@espublicar.com
                  </a>
                  . Responderemos en un plazo máximo de 30 días.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Seguridad</h2>
              <div className="legal-v2-prose">
                <p>
                  Implementamos medidas técnicas y organizativas para proteger
                  tus datos: cifrado en tránsito (HTTPS/TLS), cifrado en
                  reposo, control de acceso y auditorías periódicas. No
                  almacenamos contraseñas en texto plano.
                </p>
                <p>
                  Si detectáramos una brecha de seguridad que afecte a tus
                  datos, te avisaremos dentro de las 72 horas posteriores a
                  tener conocimiento.
                </p>
              </div>
            </section>

            <section className="legal-v2-section">
              <h2 className="legal-v2-section-title">Cambios en esta política</h2>
              <div className="legal-v2-prose">
                <p>
                  Podemos actualizar esta política para reflejar cambios en la
                  ley o en nuestros servicios. Te avisaremos por correo antes
                  de que entren en vigor cambios significativos.
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
