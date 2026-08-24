"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const POPULAR = ["iPhone", "Bicicleta", "Sofá", "PS5", "Cochecito"];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const close = () => {
    const el = document.getElementById("search");
    if (!el) return;
    const bootstrap = require("bootstrap");
    bootstrap.Offcanvas.getInstance(el)?.hide();
  };

  const go = (q: string) => {
    const term = q.trim();
    if (!term) return;
    close();
    router.push(`/shop-default?query=${encodeURIComponent(term)}`);
  };

  return (
    <div className="offcanvas offcanvas-top offcanvas-search" id="search">
      <div className="offcanvas-content">
        <div className="popup-header">
          <button
            className="icon-close icon-close-popup link"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          />
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="looking-for-wrap">
                <h3 className="heading fw-semibold text-center">
                  ¿Qué estás buscando?
                </h3>
                <form
                  className="form-search"
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    go(query);
                  }}
                >
                  <fieldset>
                    <input
                      type="search"
                      placeholder="Busca cualquier cosa… iPhone, bici, sofá"
                      name="query"
                      aria-label="Buscar"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </fieldset>
                  <button type="submit" className="button-submit" aria-label="Buscar">
                    <i className="icon-search" />
                  </button>
                </form>
                <div className="popular-searches justify-content-md-center">
                  <span className="text fw-semibold body-text-3">
                    Búsquedas populares:
                  </span>
                  <ul>
                    {POPULAR.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          className="link body-text-3 fw-medium"
                          onClick={() => go(term)}
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
