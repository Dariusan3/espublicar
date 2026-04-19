"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, ID, Query } from "@/lib/appwrite";
import { HookResponse } from "@/types/Types";
import { toConversation, toMessages, toMessage } from "@/helpers/dbHelpers";

const useChat = () => {
  const [loading, setLoading] = useState(false);

  const getMyConversations = useCallback(
    async (userId: string): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.CONVERSATIONS,
          [
            Query.contains("participants", userId),
            Query.orderDesc("lastMessageAt"),
          ],
        );
        return {
          success: true,
          message: "Conversations fetched",
          data: response.documents.map(toConversation),
        };
      } catch (error: any) {
        console.error("Error fetching conversations:", error);
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getMessages = useCallback(
    async (conversationId: string): Promise<HookResponse> => {
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.MESSAGES,
          [
            Query.equal("conversationId", conversationId),
            Query.orderAsc("$createdAt"),
            Query.limit(100),
          ],
        );
        return {
          success: true,
          message: "Messages fetched",
          data: toMessages(response.documents),
        };
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (
      conversationId: string,
      senderId: string,
      text: string,
    ): Promise<HookResponse> => {
      try {
        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.MESSAGES,
          ID.unique(),
          { conversationId, senderId, text, isRead: false },
        );

        await db.updateDocument(
          DB_ID,
          COLLECTIONS.CONVERSATIONS,
          conversationId,
          {
            lastMessage: text,
            lastMessageAuthorId: senderId,
            lastMessageAt: new Date().toISOString(),
          },
        );

        return {
          success: true,
          message: "Message sent",
          data: toMessage(result),
        };
      } catch (error: any) {
        console.error("Error sending message:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const startConversation = useCallback(
    async (
      buyerId: string,
      sellerId: string,
      productId: string,
    ): Promise<HookResponse> => {
      try {
        const existing = await db.listDocuments(
          DB_ID,
          COLLECTIONS.CONVERSATIONS,
          [
            Query.equal("productId", productId),
            Query.contains("participants", buyerId),
            Query.contains("participants", sellerId),
          ],
        );

        if (existing.total > 0) {
          return {
            success: true,
            message: "Existing conversation found",
            data: toConversation(existing.documents[0]),
          };
        }

        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.CONVERSATIONS,
          ID.unique(),
          {
            participants: [buyerId, sellerId],
            productId,
            lastMessageAt: new Date().toISOString(),
          },
        );

        return {
          success: true,
          message: "Conversation started",
          data: toConversation(result),
        };
      } catch (error: any) {
        console.error("Error starting conversation:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  return {
    loading,
    getMyConversations,
    getMessages,
    sendMessage,
    startConversation,
  };
};

export default useChat;
