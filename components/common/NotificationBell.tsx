"use client";
import React, { useEffect, useState, useRef } from "react";
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
      return `/my-account-messages?conversationId=${n.referenceId}`;
    case "order":
      return "/my-account-orders";
    case "offer":
      return "/my-account-offers";
    case "product":
      return `/product/${n.referenceId}`;
    default:
      return "/my-account-notifications";
  }
}

export default function NotificationBell() {
  const { user } = useAuth();
  const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    getUnreadCount(user.$id);
    // Poll for unread count every 30 seconds
    const interval = setInterval(() => getUnreadCount(user.$id), 30000);
    return () => clearInterval(interval);
  }, [user, getUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    if (!user) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      const res = await getMyNotifications(user.$id, 10);
      if (res.success) setNotifications(res.data);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllAsRead(user.$id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClickNotification = async (n: Notification) => {
    if (!n.isRead) {
      await markAsRead(n.id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === n.id ? { ...notif, isRead: true } : notif,
        ),
      );
    }
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-link p-0 position-relative border-0"
        onClick={handleOpen}
        style={{ lineHeight: 1 }}
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="#333E48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="#333E48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem", padding: "3px 5px" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border"
          style={{
            width: "360px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1050,
          }}
        >
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
            <h6 className="mb-0 fw-bold">Notificaciones</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-link btn-sm p-0 text-decoration-none"
                onClick={handleMarkAllRead}
              >
                Marcar todo leído
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-4">
              <i className="icon-bell fs-1 text-muted mb-2 d-block"></i>
              <p className="text-muted small mb-0">Sin notificaciones</p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={getNotificationLink(n)}
                  className={`d-flex gap-3 p-3 text-decoration-none border-bottom ${
                    !n.isRead ? "bg-light" : ""
                  }`}
                  onClick={() => handleClickNotification(n)}
                  style={{ transition: "background 0.15s" }}
                >
                  <div className="flex-shrink-0">
                    <i
                      className={`${typeIcons[n.type] || "icon-bell"} fs-5 text-primary`}
                    ></i>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <p
                      className={`mb-0 small ${!n.isRead ? "fw-semibold text-dark" : "text-muted"}`}
                    >
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mb-0 small text-muted text-truncate">
                        {n.body}
                      </p>
                    )}
                    <small className="text-muted">
                      {timeAgo(n.createdAt)}
                    </small>
                  </div>
                  {!n.isRead && (
                    <div className="flex-shrink-0 align-self-center">
                      <span
                        className="rounded-circle bg-primary d-inline-block"
                        style={{ width: "8px", height: "8px" }}
                      ></span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="p-2 text-center border-top">
            <Link
              href="/my-account-notifications"
              className="btn btn-link btn-sm text-decoration-none"
              onClick={() => setIsOpen(false)}
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
