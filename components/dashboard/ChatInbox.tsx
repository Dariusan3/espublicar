"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import { Conversation, Message } from "@/types/Types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function ChatInbox() {
  const { user } = useAuth();
  const { getMyConversations, getMessages, sendMessage, loading } = useChat();
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("conversationId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      const fetchConvs = async () => {
        const result = await getMyConversations(user.$id);
        if (result.success) {
          setConversations(result.data);

          if (initialConvId) {
            const found = result.data.find(
              (c: Conversation) => c.id === initialConvId,
            );
            if (found) setSelectedConversation(found);
          }
        }
      };
      fetchConvs();
    }
  }, [user, getMyConversations, initialConvId]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMsgs = async () => {
        const result = await getMessages(selectedConversation.id);
        if (result.success) {
          setMessages(result.data);
        }
      };
      fetchMsgs();

      // Set interval for polling messages (simplified realtime fallback)
      const interval = setInterval(fetchMsgs, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user || isSending)
      return;

    setIsSending(true);
    const result = await sendMessage(
      selectedConversation.id,
      user.$id,
      newMessage.trim(),
    );

    if (result.success) {
      setMessages((prev) => [...prev, result.data]);
      setNewMessage("");
    } else {
      toast.error("Error al enviar el mensaje");
    }
    setIsSending(false);
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p !== user?.$id) || "Usuario";
  };

  if (!user) return <div className="p-5 text-center">Cargando...</div>;

  return (
    <div className="chat-container bg-white rounded-4 shadow-sm overflow-hidden border">
      <div className="row g-0 h-100" style={{ minHeight: "600px" }}>
        {/* Left Sidebar: Conversations */}
        <div className="col-md-4 border-end chat-sidebar">
          <div className="p-3 border-bottom bg-light">
            <h6 className="fw-bold mb-0">Mensajes</h6>
          </div>
          <div
            className="overflow-auto"
            style={{ height: "calc(600px - 57px)" }}
          >
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="icon-message-square fs-1 mb-2 d-block op-3"></i>
                <p>No tienes conversaciones aún</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 border-bottom cursor-pointer transition-all hover-bg-light ${
                    selectedConversation?.id === conv.id
                      ? "bg-primary-subtle border-start border-primary border-4"
                      : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-bold small">
                      {getOtherParticipant(conv)}
                    </span>
                    <span className="text-muted" style={{ fontSize: "10px" }}>
                      {conv.lastMessageAt
                        ? new Date(conv.lastMessageAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-truncate mb-0 small text-muted">
                    {conv.lastMessage || "Sin mensajes aún"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Chat Room */}
        <div className="col-md-8 d-flex flex-column h-100 chat-main">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-0">
                    {getOtherParticipant(selectedConversation)}
                  </h6>
                  <span className="small text-muted">
                    ID: {selectedConversation.id.slice(0, 8)}
                  </span>
                </div>
                {/* Link to Product */}
                {selectedConversation.productId && (
                  <Link
                    href={`/product/${selectedConversation.productId}`}
                    className="btn btn-sm btn-outline-primary rounded-pill"
                    style={{ fontSize: "12px" }}
                  >
                    Ver Producto
                  </Link>
                )}
              </div>

              {/* Message List */}
              <div
                className="p-4 overflow-auto flex-grow-1 bg-chat"
                style={{ height: "calc(600px - 135px)" }}
              >
                {messages.length === 0 ? (
                  <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                    Di "Hola" para empezar la conversación
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`d-flex mb-3 ${msg.senderId === user.$id ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        className={`p-3 rounded-4 shadow-sm max-width-75 ${
                          msg.senderId === user.$id
                            ? "bg-primary text-white rounded-bottom-end-0"
                            : "bg-white text-dark rounded-bottom-start-0 border"
                        }`}
                      >
                        <p className="mb-1" style={{ fontSize: "14px" }}>
                          {msg.text}
                        </p>
                        <span
                          className={`d-block text-end ${msg.senderId === user.$id ? "text-white-50" : "text-muted"}`}
                          style={{ fontSize: "10px" }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 border-top bg-white">
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control rounded-pill border-light bg-light px-3"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                    disabled={!newMessage.trim() || isSending}
                  >
                    <i className="icon-send fs-5"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
              <i
                className="icon-message-circle fs-1 mb-3 op-2"
                style={{ fontSize: "5rem !important" }}
              ></i>
              <h5>Selecciona una conversación</h5>
              <p>Tus mensajes aparecerán aquí cuando selecciones a alguien.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          height: 600px;
        }
        .max-width-75 {
          max-width: 75%;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .bg-chat {
          background-color: #f0f2f5;
          background-image: url("https://www.transparenttextures.com/patterns/cubes.png");
        }
        .op-2 {
          opacity: 0.2;
        }
        .op-3 {
          opacity: 0.3;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
