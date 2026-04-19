import NotificationsList from "@/components/dashboard/NotificationsList";
import React from "react";

export const metadata = {
  title: "Notificaciones | espublicar",
  description: "Tus notificaciones",
};

export default function Page() {
  return <NotificationsList />;
}
