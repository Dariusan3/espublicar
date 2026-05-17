"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useReports from "@/hooks/useReports";
import { toast } from "react-toastify";

const REASONS = [
  "Producto falsificado o sospechoso",
  "Contenido inapropiado u ofensivo",
  "Spam o anuncio duplicado",
  "Precio engañoso",
  "Posible estafa",
  "Otro",
];

interface ReportModalProps {
  targetId: string;
  targetType: "product" | "user";
  targetTitle?: string;
  onClose: () => void;
}

export default function ReportModal({
  targetId,
  targetType,
  targetTitle,
  onClose,
}: ReportModalProps) {
  const { user } = useAuth();
  const { createReport } = useReports();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Inicia sesión para reportar");
      return;
    }
    if (!reason) {
      toast.error("Selecciona un motivo");
      return;
    }

    setIsSubmitting(true);
    const res = await createReport({
      reporterId: user.$id,
      targetId,
      targetType,
      reason,
      description: description.trim(),
    });

    if (res.success) {
      toast.success("Gracias, hemos recibido tu reporte. Lo revisaremos pronto.");
      onClose();
    } else {
      toast.error(res.message || "Error al enviar el reporte");
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(15,23,42,0.48)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "var(--radius-lg)",
            border: 0,
            boxShadow: "var(--elev-4)",
          }}
        >
          <div
            className="modal-header"
            style={{ borderBottom: "1px solid var(--line)", padding: "var(--space-4) var(--space-5)" }}
          >
            <h5 style={{ margin: 0, font: "600 17px/1.3 'Inter', sans-serif", color: "var(--ink)" }}>
              Reportar {targetType === "product" ? "anuncio" : "usuario"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            />
          </div>

          <form onSubmit={handleSubmit} className="modal-body" style={{ padding: "var(--space-5)" }}>
            {targetTitle && (
              <p
                className="text-ink-3"
                style={{ fontSize: 13, marginBottom: "var(--space-4)" }}
              >
                {targetType === "product" ? "Anuncio" : "Usuario"}:{" "}
                <strong style={{ color: "var(--ink)" }}>{targetTitle}</strong>
              </p>
            )}

            <div className="publicar-v2-field" style={{ marginBottom: "var(--space-4)" }}>
              <label className="publicar-v2-label">Motivo</label>
              <div className="publicar-v2-chip-group">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`chip ${reason === r ? "is-active" : ""}`}
                    onClick={() => setReason(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="publicar-v2-field">
              <label className="publicar-v2-label">
                Detalles adicionales (opcional)
              </label>
              <textarea
                className="input-field"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntanos más sobre el problema…"
                maxLength={500}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                marginTop: "var(--space-5)",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn-ghost"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando…" : "Enviar reporte"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
