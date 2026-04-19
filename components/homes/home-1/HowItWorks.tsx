import React from "react";

const STEPS = [
  {
    num: "1",
    title: "Publica gratis",
    caption: "Tu anuncio en menos de 60 segundos. Sin comisiones por publicar.",
  },
  {
    num: "2",
    title: "Chatea y negocia",
    caption:
      "Habla con el comprador en el chat integrado y acepta ofertas al instante.",
  },
  {
    num: "3",
    title: "Paga seguro con Bizum",
    caption:
      "Dinero retenido hasta confirmar que llegó bien. Reembolso garantizado.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <header className="section-head">
          <h2>Así funciona espublicar</h2>
        </header>
        <div className="how-it-works-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="how-step">
              <div className="how-step-num">{step.num}</div>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-caption">{step.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
