"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import { toast } from "react-toastify";

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Por favor, completa los campos obligatorios");
      return;
    }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("¡Mensaje enviado! Te responderemos en menos de 24 h.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setIsSending(false);
  };

  return (
    <>
      <Header1 />
      <section className="legal-v2">
        <div className="legal-v2-container" style={{ maxWidth: "1040px" }}>
          <nav className="pd-v2-breadcrumb" aria-label="Navegación" style={{ marginBottom: "var(--space-6)" }}>
            <Link href="/">Inicio</Link>
            <span className="pd-v2-breadcrumb-sep">›</span>
            <span>Contacto</span>
          </nav>

          <header className="legal-v2-header">
            <span className="legal-v2-eyebrow">¿Hablamos?</span>
            <h1 className="legal-v2-title">Estamos aquí para ayudarte.</h1>
            <p className="legal-v2-lead">
              ¿Tienes alguna duda sobre un anuncio, un pago o quieres
              reportarnos algo? Escríbenos y te responderemos lo antes posible.
            </p>
          </header>

          <div className="contact-v2-layout">
            <div className="legal-v2-card">
              <form onSubmit={handleSubmit} className="stack-5">
                <div className="publicar-v2-field">
                  <label className="publicar-v2-label">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="publicar-v2-field">
                  <label className="publicar-v2-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                </div>
                <div className="publicar-v2-field">
                  <label className="publicar-v2-label">Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    className="input-field"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Ej: Problema con mi pedido"
                  />
                </div>
                <div className="publicar-v2-field">
                  <label className="publicar-v2-label">Mensaje</label>
                  <textarea
                    name="message"
                    className="input-field"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos qué necesitas…"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-brand btn-lg"
                  disabled={isSending}
                >
                  {isSending ? "Enviando…" : "Enviar mensaje"}
                </button>
              </form>
            </div>

            <aside className="contact-v2-info">
              <div className="contact-v2-info-card">
                <h3>Email</h3>
                <p>
                  Escríbenos a{" "}
                  <a href="mailto:soporte@espublicar.com">
                    soporte@espublicar.com
                  </a>
                  {" "}y respondemos en menos de 24 h.
                </p>
              </div>
              <div className="contact-v2-info-card">
                <h3>Centro de ayuda</h3>
                <p>
                  La mayoría de preguntas tienen respuesta en nuestras{" "}
                  <Link href="/faq">preguntas frecuentes</Link>.
                </p>
              </div>
              <div className="contact-v2-info-card">
                <h3>Denuncias</h3>
                <p>
                  Para reportar un usuario o anuncio sospechoso, usa el botón
                  &ldquo;Reportar&rdquo; dentro del propio anuncio.
                </p>
              </div>
              <div className="contact-v2-info-card">
                <h3>Prensa</h3>
                <p>
                  Para consultas de medios:{" "}
                  <a href="mailto:prensa@espublicar.com">
                    prensa@espublicar.com
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
