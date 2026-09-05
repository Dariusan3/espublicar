"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useConfirm } from "@/components/common/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { db, DB_ID, COLLECTIONS } from "@/lib/supabase";
import { EmptyState } from "@/components/common/Skeleton";
import { toast } from "react-toastify";

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  extra?: string;
  zipCode: string;
  city: string;
  province: string;
  isDefault: boolean;
}

const EMPTY: Omit<SavedAddress, "id" | "isDefault"> = {
  label: "",
  fullName: "",
  phone: "",
  street: "",
  extra: "",
  zipCode: "",
  city: "",
  province: "",
};

export default function Address() {
  const { user } = useAuth();
  const confirm = useConfirm();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const profile = await db.getDocument(DB_ID, COLLECTIONS.USERS, user.$id);
      setAddresses(Array.isArray(profile.addresses) ? profile.addresses : []);
    } catch {
      setAddresses([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  /** Addresses live on the profile row, so every change writes the whole list. */
  const persist = async (next: SavedAddress[]) => {
    if (!user) return false;
    setSaving(true);
    try {
      await db.updateDocument(DB_ID, COLLECTIONS.USERS, user.$id, {
        addresses: next,
      });
      setAddresses(next);
      return true;
    } catch (error: any) {
      toast.error("No se pudo guardar la dirección");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openNew = () => {
    setForm({ ...EMPTY });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (address: SavedAddress) => {
    const { id, isDefault, ...rest } = address;
    setForm({ ...EMPTY, ...rest });
    setEditingId(id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = [form.fullName, form.street, form.zipCode, form.city];
    if (required.some((value) => !value.trim())) {
      toast.error("Completa nombre, dirección, código postal y ciudad");
      return;
    }

    const entry: SavedAddress = {
      id: editingId || crypto.randomUUID(),
      label: form.label.trim() || form.street.trim(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      street: form.street.trim(),
      extra: form.extra?.trim() || "",
      zipCode: form.zipCode.trim(),
      city: form.city.trim(),
      province: form.province.trim(),
      isDefault: editingId
        ? addresses.find((a) => a.id === editingId)?.isDefault || false
        : addresses.length === 0,
    };

    const next = editingId
      ? addresses.map((a) => (a.id === editingId ? entry : a))
      : [...addresses, entry];

    if (await persist(next)) {
      toast.success(editingId ? "Dirección actualizada" : "Dirección guardada");
      closeForm();
    }
  };

  const handleDelete = async (address: SavedAddress) => {
    const ok = await confirm({
      title: "¿Eliminar esta dirección?",
      description: `"${address.label}" dejará de aparecer al finalizar la compra.`,
      confirmLabel: "Eliminar dirección",
      cancelLabel: "Volver",
      tone: "danger",
    });
    if (!ok) return;

    let next = addresses.filter((a) => a.id !== address.id);
    // Never leave the list without a default: the first one takes over.
    if (address.isDefault && next.length > 0) {
      next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
    }
    if (await persist(next)) toast.success("Dirección eliminada");
  };

  const handleSetDefault = async (id: string) => {
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    if (await persist(next)) toast.success("Dirección principal actualizada");
  };

  if (!user) {
    return (
      <div className="addresses-v2">
        <h4 className="orders-v2-heading">Mis direcciones</h4>
        <EmptyState
          illustration="package"
          title="Inicia sesión para guardar tus direcciones"
          description="Así no tendrás que escribirlas cada vez que compres algo."
        />
      </div>
    );
  }

  return (
    <div className="addresses-v2">
      <header className="addresses-v2-head">
        <div>
          <h4 className="orders-v2-heading">Mis direcciones</h4>
          <p className="addresses-v2-sub">
            Se usan al finalizar la compra. La principal aparece marcada.
          </p>
        </div>
        {!showForm && (
          <button type="button" className="orders-v2-btn is-primary" onClick={openNew}>
            Añadir dirección
          </button>
        )}
      </header>

      {showForm && (
        <form className="addresses-v2-form" onSubmit={handleSubmit}>
          <h5 className="addresses-v2-form-title">
            {editingId ? "Editar dirección" : "Nueva dirección"}
          </h5>

          <div className="addresses-v2-fields">
            <label className="addresses-v2-field">
              <span>Nombre y apellidos</span>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="María Gómez"
                autoComplete="name"
                required
              />
            </label>
            <label className="addresses-v2-field">
              <span>Teléfono</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+34 600 000 000"
                autoComplete="tel"
              />
            </label>
            <label className="addresses-v2-field is-wide">
              <span>Dirección</span>
              <input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="Calle Mayor 10"
                autoComplete="street-address"
                required
              />
            </label>
            <label className="addresses-v2-field is-wide">
              <span>Piso, escalera, puerta (opcional)</span>
              <input
                value={form.extra}
                onChange={(e) => setForm({ ...form, extra: e.target.value })}
                placeholder="3º B"
              />
            </label>
            <label className="addresses-v2-field">
              <span>Código postal</span>
              <input
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                placeholder="28001"
                autoComplete="postal-code"
                inputMode="numeric"
                required
              />
            </label>
            <label className="addresses-v2-field">
              <span>Ciudad</span>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Madrid"
                autoComplete="address-level2"
                required
              />
            </label>
            <label className="addresses-v2-field">
              <span>Provincia</span>
              <input
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                placeholder="Madrid"
                autoComplete="address-level1"
              />
            </label>
            <label className="addresses-v2-field">
              <span>Nombre para esta dirección (opcional)</span>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Casa, trabajo…"
              />
            </label>
          </div>

          <div className="addresses-v2-form-actions">
            <button type="submit" className="orders-v2-btn is-primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar dirección"}
            </button>
            <button type="button" className="orders-v2-btn is-ghost" onClick={closeForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="addresses-v2-grid">
          <div className="orders-v2-card is-loading" />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <EmptyState
          illustration="package"
          title="Todavía no has guardado ninguna dirección"
          description="Guarda una y la tendrás lista al finalizar la compra."
          action={{ label: "Añadir dirección", onClick: openNew }}
        />
      ) : (
        <div className="addresses-v2-grid">
          {addresses.map((address) => (
            <article key={address.id} className="addresses-v2-card">
              <header className="addresses-v2-card-head">
                <h5>{address.label}</h5>
                {address.isDefault && (
                  <span className="orders-v2-chip is-brand">Principal</span>
                )}
              </header>
              <address className="addresses-v2-body">
                <span className="addresses-v2-name">{address.fullName}</span>
                <span>
                  {address.street}
                  {address.extra ? `, ${address.extra}` : ""}
                </span>
                <span>
                  {address.zipCode} {address.city}
                  {address.province ? `, ${address.province}` : ""}
                </span>
                {address.phone && <span>{address.phone}</span>}
              </address>
              <footer className="addresses-v2-card-actions">
                <button
                  type="button"
                  className="orders-v2-btn is-ghost"
                  onClick={() => openEdit(address)}
                >
                  Editar
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    className="orders-v2-btn is-ghost"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Hacer principal
                  </button>
                )}
                <button
                  type="button"
                  className="addresses-v2-delete"
                  onClick={() => handleDelete(address)}
                >
                  Eliminar
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
