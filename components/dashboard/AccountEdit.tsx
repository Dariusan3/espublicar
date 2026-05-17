"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PhoneVerification from "./PhoneVerification";

export default function AccountEdit() {
  const { user } = useAuth();

  return (
    <div className="dashboard-v2-content">
      <header className="dashboard-v2-header">
        <div>
          <h1 className="dashboard-v2-greeting">Configuración</h1>
          <p className="dashboard-v2-subtitle">
            Gestiona tu cuenta y verificaciones.
          </p>
        </div>
      </header>

      <section className="dashboard-v2-activity-card">
        <header className="dashboard-v2-activity-head">
          <h2>Información personal</h2>
        </header>
        <div className="stack-4">
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Nombre</label>
            <input
              type="text"
              className="input-field"
              defaultValue={user?.name || ""}
              placeholder="Tu nombre"
            />
          </div>
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Correo electrónico</label>
            <input
              type="email"
              className="input-field"
              defaultValue={user?.email || ""}
              disabled
            />
            {user?.emailVerification && (
              <p
                className="text-ink-3"
                style={{ fontSize: 12, marginTop: 6 }}
              >
                ✓ Correo verificado
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-v2-activity-card">
        <header className="dashboard-v2-activity-head">
          <h2>Verificación de teléfono</h2>
        </header>
        <PhoneVerification />
      </section>
    </div>
  );
}
