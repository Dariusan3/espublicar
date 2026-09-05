"use client";

/**
 * SMS phone verification — NOT RENDERED right now.
 *
 * Supabase reports `external.phone: false`, i.e. no SMS provider is configured,
 * so every send would fail. The section is commented out in AccountEdit rather
 * than deleted: configure a provider (Authentication > Providers > Phone) and
 * put the section back, no changes needed here.
 */
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function PhoneVerification() {
  const { user, updatePhone, sendPhoneVerification, confirmPhoneVerification } =
    useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [step, setStep] = useState<"set" | "verify" | "done">(
    user?.phoneVerification ? "done" : user?.phone ? "verify" : "set",
  );
  const [loading, setLoading] = useState(false);
  // null while unknown: Supabase decides whether SMS is available at all.
  const [smsEnabled, setSmsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setSmsEnabled(false);
      return;
    }
    fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then((res) => res.json())
      .then((data) => setSmsEnabled(Boolean(data?.external?.phone)))
      .catch(() => setSmsEnabled(false));
  }, []);

  const handleSetPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Introduce un número de teléfono");
      return;
    }
    if (!password) {
      toast.error("Introduce tu contraseña para confirmar");
      return;
    }
    setLoading(true);
    const result = await updatePhone(phone.trim(), password);
    if (result.success) {
      // Auto-send verification code
      const v = await sendPhoneVerification();
      if (v.success) {
        toast.success("Te hemos enviado un código por SMS");
        setStep("verify");
        setPassword("");
      } else {
        toast.error(v.error || "Error al enviar el código");
      }
    } else {
      toast.error(result.error || "Error al guardar el teléfono");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    const v = await sendPhoneVerification();
    if (v.success) toast.success("Código reenviado");
    else toast.error(v.error || "Error al reenviar");
    setLoading(false);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;
    setLoading(true);
    const r = await confirmPhoneVerification(secret.trim());
    if (r.success) {
      toast.success("¡Teléfono verificado!");
      setStep("done");
    } else {
      toast.error(r.error || "Código incorrecto");
    }
    setLoading(false);
  };

  if (step === "done") {
    return (
      <div className="phone-verify-card phone-verify-done">
        <div className="phone-verify-icon phone-verify-icon-ok">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="phone-verify-title">Teléfono verificado</p>
          <p className="phone-verify-sub">
            {user?.phone} · Los compradores verán que estás verificado.
          </p>
        </div>
      </div>
    );
  }

  if (smsEnabled === false) {
    return (
      <div className="phone-verify-card">
        <div className="phone-verify-head">
          <div className="phone-verify-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <div>
            <p className="phone-verify-title">Verificación por SMS no disponible</p>
            <p className="phone-verify-sub">
              Todavía no enviamos mensajes. Cuando esté activa, podrás verificar
              tu número aquí y mostrarlo como sello de confianza en tus anuncios.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-verify-card">
      <div className="phone-verify-head">
        <div className="phone-verify-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>
        <div>
          <p className="phone-verify-title">Verifica tu teléfono</p>
          <p className="phone-verify-sub">
            Aumenta la confianza con un número verificado por SMS.
          </p>
        </div>
      </div>

      {step === "set" && (
        <form onSubmit={handleSetPhone} className="stack-4">
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              className="input-field"
              placeholder="+34 600 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">
              Contraseña (para confirmar)
            </label>
            <input
              type="password"
              name="current-password"
              autoComplete="current-password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-brand" disabled={loading}>
            {loading ? "Enviando…" : "Enviar código por SMS"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleConfirm} className="stack-4">
          <p className="phone-verify-sub">
            Hemos enviado un código a <strong>{user?.phone || phone}</strong>.
          </p>
          <div className="publicar-v2-field">
            <label className="publicar-v2-label">Código de verificación</label>
            <input
              type="text"
              inputMode="numeric"
              name="one-time-code"
              autoComplete="one-time-code"
              className="input-field"
              placeholder="123456"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="submit" className="btn-brand" disabled={loading}>
              {loading ? "Verificando…" : "Verificar"}
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={handleResend}
              disabled={loading}
            >
              Reenviar código
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
