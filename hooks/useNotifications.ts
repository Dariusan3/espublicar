"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, ID, Query } from "@/lib/appwrite";
import { HookResponse, Notification } from "@/types/Types";
import { toNotification, toNotifications } from "@/helpers/dbHelpers";

const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const getMyNotifications = useCallback(
    async (userId: string, limit = 50): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.NOTIFICATIONS,
          [
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(limit),
          ],
        );
        const notifications = toNotifications(response.documents);
        setUnreadCount(notifications.filter((n) => !n.isRead).length);
        return { success: true, message: "Notifications fetched", data: notifications };
      } catch (error: any) {
        if (error?.code === 404) {
          setUnreadCount(0);
          return { success: true, message: "Collection not found", data: [] };
        }
        return { success: false, message: error.message, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getUnreadCount = useCallback(
    async (userId: string): Promise<number> => {
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.NOTIFICATIONS,
          [
            Query.equal("userId", userId),
            Query.equal("isRead", false),
            Query.limit(1),
          ],
        );
        setUnreadCount(response.total);
        return response.total;
      } catch (error) {
        setUnreadCount(0);
        return 0;
      }
    },
    [],
  );

  const markAsRead = useCallback(
    async (notificationId: string): Promise<HookResponse> => {
      try {
        await db.updateDocument(DB_ID, COLLECTIONS.NOTIFICATIONS, notificationId, { isRead: true });
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return { success: true, message: "Marked as read" };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const markAllAsRead = useCallback(
    async (userId: string): Promise<HookResponse> => {
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.NOTIFICATIONS,
          [
            Query.equal("userId", userId),
            Query.equal("isRead", false),
            Query.limit(100),
          ],
        );
        await Promise.all(
          response.documents.map((doc) =>
            db.updateDocument(DB_ID, COLLECTIONS.NOTIFICATIONS, doc.$id, { isRead: true }),
          ),
        );
        setUnreadCount(0);
        return { success: true, message: "All notifications marked as read" };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const createNotification = useCallback(
    async (data: {
      userId: string;
      type: "message" | "order" | "offer" | "review" | "system";
      title: string;
      body?: string;
      referenceId?: string;
      referenceType?: string;
    }): Promise<HookResponse> => {
      try {
        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.NOTIFICATIONS,
          ID.unique(),
          { ...data, isRead: false },
        );
        return { success: true, message: "Notification created", data: toNotification(result) };
      } catch (error: any) {
        console.error("Error creating notification:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  return { loading, unreadCount, getMyNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification };
};

export default useNotifications;
