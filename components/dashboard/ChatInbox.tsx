"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import useProducts from "@/hooks/useProducts";
import { Conversation, Message, Product } from "@/types/Types";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

function timeShort(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "ayer";
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return "Hoy";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

export default function ChatInbox() {
  const { user } = useAuth();
  const { getMyConversations, getMessages, sendMessage } = useChat();
  const { getProductById } = useProducts();
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("conversationId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productCache, setProductCache] = useState<Record<string, Product>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const res = await getMyConversations(user.$id);
      if (!res.success) return;
      setConversations(res.data);

      const productIds = Array.from(
        new Set(res.data.map((c: Conversation) => c.productId).filter(Boolean)),
      );
      const cache: Record<string, Product> = {};
      await Promise.all(
        productIds.map(async (pid: any) => {
          const p = await getProductById(pid);
          if (p.success) cache[pid] = p.data;
        }),
      );
      setProductCache(cache);

      if (initialConvId) {
        const found = res.data.find((c: Conversation) => c.id === initialConvId);
        if (found) setSelected(found);
      }
    };
    load();
  }, [user, getMyConversations, getProductById, initialConvId]);

  useEffect(() => {
    if (!selected) return;
    const load = async () => {
      const res = await getMessages(selected.id);
      if (res.success) setMessages(res.data);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selected, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !selected || !user || isSending) return;

    setIsSending(true);
    const res = await sendMessage(selected.id, user.$id, newMessage.trim());
    if (res.success) {
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } else {
      toast.error("Error al enviar el mensaje");
    }
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherId = (conv: Conversation) =>
    conv.participants.find((p) => p !== user?.$id) || "Usuario";

  const filteredConvs = conversations.filter((c) => {
    if (!searchQuery) return true;
    const product = productCache[c.productId];
    const haystack = `${product?.title || ""} ${c.lastMessage || ""}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return <div className="chat-v2-empty">Inicia sesión para ver tus mensajes</div>;
  }

  const selectedProduct = selected ? productCache[selected.productId] : null;

  const grouped: Array<{ day: string; items: Message[] }> = [];
  messages.forEach((m) => {
    const day = dayLabel(m.createdAt);
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) {
      last.items.push(m);
    } else {
      grouped.push({ day, items: [m] });
    }
  });

  return (
    <div className="chat-v2">
      <aside className={`chat-v2-pane-left ${selected ? "is-hidden-mobile" : ""}`}>
        <div className="chat-v2-search">
          <input
            type="search"
            className="input-search"
            placeholder="Buscar conversación"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredConvs.length === 0 ? (
          <div className="chat-v2-empty-list">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="chat-v2-empty-title">Aún no tienes mensajes</p>
            <p className="chat-v2-empty-caption">
              Cuando alguien te contacte por un anuncio, lo verás aquí.
            </p>
          </div>
        ) : (
          <ul className="chat-v2-conv-list">
            {filteredConvs.map((conv) => {
              const otherId = getOtherId(conv);
              const product = productCache[conv.productId];
              const initial = otherId.charAt(0).toUpperCase();
              const active = selected?.id === conv.id;

              return (
                <li
                  key={conv.id}
                  className={`chat-v2-conv-row ${active ? "is-active" : ""}`}
                  onClick={() => setSelected(conv)}
                >
                  <div className="chat-v2-conv-avatar">{initial}</div>
                  <div className="chat-v2-conv-body">
                    <div className="chat-v2-conv-row-top">
                      <span className="chat-v2-conv-name">Usuario</span>
                      <span className="chat-v2-conv-time">
                        {timeShort(conv.lastMessageAt)}
                      </span>
                    </div>
                    {product && (
                      <p className="chat-v2-conv-listing">{product.title}</p>
                    )}
                    <p className="chat-v2-conv-preview">
                      {conv.lastMessage || "Sin mensajes aún"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className={`chat-v2-pane-right ${selected ? "is-visible-mobile" : ""}`}>
        {!selected ? (
          <div className="chat-v2-thread-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h3>Selecciona una conversación</h3>
            <p>Tus mensajes aparecerán aquí cuando elijas a alguien.</p>
          </div>
        ) : (
          <>
            <div className="chat-v2-thread-header">
              <button
                type="button"
                className="chat-v2-back"
                onClick={() => setSelected(null)}
                aria-label="Volver"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <div className="chat-v2-thread-avatar">
                {getOtherId(selected).charAt(0).toUpperCase()}
              </div>
              <div className="chat-v2-thread-info">
                <p className="chat-v2-thread-name">Usuario</p>
                {selectedProduct && (
                  <Link
                    href={`/product/${selected.productId}`}
                    className="chat-v2-thread-listing"
                  >
                    {selectedProduct.title} ·{" "}
                    <strong>{Math.round(selectedProduct.price)} €</strong>
                  </Link>
                )}
              </div>
              {selectedProduct && (
                <Link
                  href={`/product/${selected.productId}`}
                  className="chat-v2-thread-action"
                  aria-label="Ver anuncio"
                  title="Ver anuncio"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Link>
              )}
            </div>

            <div className="chat-v2-messages">
              {grouped.map((group, gi) => (
                <React.Fragment key={gi}>
                  <div className="chat-v2-day-sep">
                    <span>{group.day}</span>
                  </div>
                  {group.items.map((msg) => {
                    const isMe = msg.senderId === user.$id;
                    return (
                      <div
                        key={msg.id}
                        className={`chat-v2-msg ${isMe ? "is-me" : ""}`}
                      >
                        <div className="chat-v2-bubble">{msg.text}</div>
                        <span className="chat-v2-msg-time">
                          {new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-v2-composer" onSubmit={handleSend}>
              <button
                type="button"
                className="chat-v2-composer-attach"
                aria-label="Adjuntar"
                title="Próximamente"
                disabled
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <textarea
                className="chat-v2-composer-input"
                placeholder="Escribe un mensaje…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isSending}
              />
              <button
                type="submit"
                className="chat-v2-composer-send"
                disabled={!newMessage.trim() || isSending}
                aria-label="Enviar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
