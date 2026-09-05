"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useNotifications from "@/hooks/useNotifications";
import { Notification } from "@/types/Types";
import Link from "next/link";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

const typeIcons: Record<string, string> = {
  message: "icon-message-circle",
  order: "icon-package",
  offer: "icon-tag",
  review: "icon-star",
  system: "icon-bell",
};

function getNotificationLink(n: Notification): string {
  switch (n.referenceType) {
    case "conversation":
      return `/mi-cuenta/mensajes?conversationId=${n.referenceId}`;
    case "order":
      return "/mi-cuenta/pedidos";
    case "offer":
      return "/mi-cuenta/ofertas";
    case "product":
      return `/product/${n.referenceId}`;
    default:
      return "#";
  }
}

export default function NotificationsList() {
  const { user } = useAuth();
  const { getMyNotifications, markAsRead, markAllAsRead, loading, unreadCount } =
    useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const res = await getMyNotifications(user.$id, 100);
      if (res.success) setNotifications(res.data);
    };
    load();
  }, [user, getMyNotifications]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllAsRead(user.$id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      await markAsRead(n.id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === n.id ? { ...notif, isRead: true } : notif,
        ),
      );
    }
  };

  return (
    <div
      className="p-4 rounded-4"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold mb-0">
          <i className="icon-bell me-2 text-primary"></i>
          Notificaciones
        </h4>
        {unreadCount > 0 && (
          <button
            className="btn btn-sm btn-outline-primary rounded-pill"
            onClick={handleMarkAllRead}
          >
            Marcar todo leído
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm"></div>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-5">
          <i className="icon-bell fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">No tienes notificaciones.</p>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {notifications.map((n) => (
            <Link
              key={n.id}
              href={getNotificationLink(n)}
              className={`d-flex gap-3 p-3 rounded-3 text-decoration-none border ${
                !n.isRead ? "bg-light border-primary-subtle" : ""
              }`}
              onClick={() => handleClick(n)}
            >
              <div className="flex-shrink-0">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${
                    !n.isRead ? "bg-primary text-white" : "bg-light text-muted"
                  }`}
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className={typeIcons[n.type] || "icon-bell"}></i>
                </div>
              </div>
              <div className="flex-grow-1">
                <p
                  className={`mb-0 ${!n.isRead ? "fw-semibold text-dark" : "text-muted"}`}
                >
                  {n.title}
                </p>
                {n.body && (
                  <p className="mb-0 small text-muted">{n.body}</p>
                )}
                <small className="text-muted">{timeAgo(n.createdAt)}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
