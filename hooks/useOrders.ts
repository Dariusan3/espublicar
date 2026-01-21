"use client";
import { useCallback } from "react";
import { db, DB_ID, ORDERS_COLLECTION_ID, id, Query } from "@/lib/appwrite";
import { OrderDB, HookResponse } from "@/types/Types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toOrder } from "@/helpers/dbHelpers";
import { toast } from "react-toastify";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imgSrc?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Custom hook for order operations with Appwrite
 */
const useOrders = () => {
  /**
   * Create a new order
   */
  const createOrder = useCallback(
    async (
      items: OrderItem[],
      totalAmount: number,
      shippingAddress: ShippingAddress,
      paymentMethod: string = "card",
      notes?: string,
    ): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/appwrite");
        const currentUser = await account.get();

        const orderData: OrderDB = {
          userId: currentUser.$id,
          items: JSON.stringify(items),
          totalAmount,
          status: "pending",
          shippingAddress: JSON.stringify(shippingAddress),
          paymentMethod,
          paymentStatus: "pending",
          notes: notes || "",
        };

        const result = await db.createDocument({
          databaseId: DB_ID,
          collectionId: ORDERS_COLLECTION_ID,
          documentId: id.unique(),
          data: orderData,
        });

        const order = toOrder(result);

        toast.success("🎉 Order placed successfully!");

        return {
          success: true,
          message: "Order created successfully",
          data: order,
        };
      } catch (error: any) {
        console.error("Error creating order:", error);
        toast.error("Failed to place order. Please try again.");
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Fetch current user's orders
   */
  const getMyOrders = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();

      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: ORDERS_COLLECTION_ID,
        queries: [
          Query.equal("userId", currentUser.$id),
          Query.orderDesc("$createdAt"),
        ],
      });

      const orders = response.documents.map(toOrder);

      return {
        success: true,
        message: "Orders fetched successfully",
        data: orders,
      };
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }, []);

  /**
   * Fetch a single order by ID
   */
  const getOrderById = useCallback(
    async (orderId: string): Promise<HookResponse> => {
      try {
        const result = await db.getDocument({
          databaseId: DB_ID,
          collectionId: ORDERS_COLLECTION_ID,
          documentId: orderId,
        });

        const order = toOrder(result);

        return {
          success: true,
          message: "Order fetched successfully",
          data: order,
        };
      } catch (error: any) {
        console.error("Error fetching order:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  /**
   * Update order status (admin function)
   */
  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<HookResponse> => {
      try {
        const result = await db.updateDocument({
          databaseId: DB_ID,
          collectionId: ORDERS_COLLECTION_ID,
          documentId: orderId,
          data: { status },
        });

        const order = toOrder(result);
        toast.success(`Order status updated to ${status}`);

        return {
          success: true,
          message: "Order status updated",
          data: order,
        };
      } catch (error: any) {
        console.error("Error updating order:", error);
        toast.error("Failed to update order status");
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [],
  );

  return {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
  };
};

export default useOrders;
