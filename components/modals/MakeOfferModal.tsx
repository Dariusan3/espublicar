"use client";
import React, { useState } from "react";
import useOffers from "@/hooks/useOffers";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import useChat from "@/hooks/useChat";

interface MakeOfferModalProps {
  productId: string;
  sellerId: string;
  currentPrice: number;
  productTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MakeOfferModal({
  productId,
  sellerId,
  currentPrice,
  productTitle,
  onClose,
  onSuccess,
}: MakeOfferModalProps) {
  const { user } = useAuth();
  const { makeOffer } = useOffers();
  const { startConversation, sendMessage } = useChat();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Inicia sesión para hacer una oferta");
      return;
    }

    const offerAmount = parseFloat(amount);
    if (isNaN(offerAmount) || offerAmount <= 0) {
      toast.error("Introduce un precio válido");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await makeOffer(
        productId,
        user.$id,
        sellerId,
        offerAmount,
        message,
      );
      if (result.success) {
        // Mirror the offer into the chat thread so the seller sees the amount
        // where the conversation happens, not only in the offers list.
        try {
          const conversation = await startConversation(
            user.$id,
            sellerId,
            productId,
          );
          if (conversation.success && conversation.data) {
            const body = message.trim()
              ? `Oferta de ${offerAmount} € por ${productTitle}. ${message.trim()}`
              : `Oferta de ${offerAmount} € por ${productTitle}`;
            await sendMessage(conversation.data.id, user.$id, body, {
              type: "offer",
              offerId: (result.data as any)?.id,
            });
          }
        } catch (chatError) {
          console.error("Offer sent but chat message failed:", chatError);
        }

        toast.success("¡Oferta enviada al vendedor!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error al enviar la oferta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Hacer una oferta</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-3">{productTitle}</p>
            <p className="mb-4">
              Precio actual:{" "}
              <strong className="text-primary">€{currentPrice.toFixed(2)}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Tu oferta (€)</label>
                <div className="input-group">
                  <span className="input-group-text">€</span>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Mensaje (opcional)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej: Estoy muy interesado, ¿aceptarías este precio?"
                  maxLength={500}
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-fill rounded-pill"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-fill rounded-pill fw-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="icon-send me-2"></i>
                  )}
                  Enviar oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
