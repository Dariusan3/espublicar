"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, ID, Query } from "@/lib/appwrite";
import { HookResponse, Conversation, Message } from "@/types/Types";
import { toConversation, toMessages, toMessage } from "@/helpers/dbHelpers";
import { toast } from "react-toastify";

const useChat = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Get all conversations for the current user
   */
  const getMyConversations = useCallback(
    async (userId: string): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.CONVERSATIONS,
          queries: [
            Query.contains("participants", userId),
            Query.orderDesc("lastMessageAt"),
          ],
        });

        const conversations = response.documents.map(toConversation);
        return {
          success: true,
          message: "Conversations fetched",
          data: conversations,
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

  /**
   * Get messages for a specific conversation
   */
  const getMessages = useCallback(
    async (conversationId: string): Promise<HookResponse> => {
      try {
        const response = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.MESSAGES,
          queries: [
            Query.equal("conversationId", conversationId),
            Query.orderAsc("$createdAt"),
            Query.limit(100),
          ],
        });

        const messages = toMessages(response.documents);
        return {
          success: true,
          message: "Messages fetched",
          data: messages,
        };
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    async (
      conversationId: string,
      senderId: string,
      text: string,
    ): Promise<HookResponse> => {
      try {
        const messageData = {
          conversationId,
          senderId,
          text,
          isRead: false,
        };

        const result = await db.createDocument({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.MESSAGES,
          documentId: ID.unique(),
          data: messageData,
        });

        // Update conversation's last message
        await db.updateDocument({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.CONVERSATIONS,
          documentId: conversationId,
          data: {
            lastMessage: text,
            lastMessageAuthorId: senderId,
            lastMessageAt: new Date().toISOString(),
          },
        });

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

  /**
   * Start or get existing conversation
   */
  const startConversation = useCallback(
    async (
      buyerId: string,
      sellerId: string,
      productId: string,
    ): Promise<HookResponse> => {
      try {
        // Check if conversation already exists for this product between these users
        const existing = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.CONVERSATIONS,
          queries: [
            Query.equal("productId", productId),
            Query.contains("participants", buyerId),
            Query.contains("participants", sellerId),
          ],
        });

        if (existing.total > 0) {
          return {
            success: true,
            message: "Existing conversation found",
            data: toConversation(existing.documents[0]),
          };
        }

        // Create new conversation
        const conversationData = {
          participants: [buyerId, sellerId],
          productId,
          lastMessageAt: new Date().toISOString(),
        };

        const result = await db.createDocument({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.CONVERSATIONS,
          documentId: ID.unique(),
          data: conversationData,
        });

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
