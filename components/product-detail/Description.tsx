"use client";
import React from "react";

interface DescriptionProps {
  product?: any;
  productId?: string;
}

export default function Description({ product }: DescriptionProps) {
  if (!product) return null;

  const tags = [
    product.category,
    product.condition,
    product.location,
    product.isNegotiable ? "negociable" : null,
  ].filter(Boolean);

  return (
    <section className="pd-v2-description">
      <div className="pd-v2-container">
        <div className="pd-v2-description-inner">
          <h2 className="pd-v2-description-title">Descripción</h2>
          <div className="pd-v2-description-body">
            {product.description ? (
              product.description.split("\n").map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))
            ) : (
              <p className="pd-v2-description-empty">
                El vendedor no ha añadido descripción para este artículo.
              </p>
            )}
          </div>

          {tags.length > 0 && (
            <div className="pd-v2-tags">
              <span className="pd-v2-tags-label">Etiquetas:</span>
              <div className="pd-v2-tags-list">
                {tags.map((tag) => (
                  <span key={tag} className="chip">
                    {String(tag).toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
