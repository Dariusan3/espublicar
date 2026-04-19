"use client";
import { useCallback } from "react";
import { db, DB_ID, ORDERS_COLLECTION_ID, id, Query } from "@/lib/appwrite";
import { OrderDB, HookResponse } from "@/types/Types";
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

const useOrders = () => {
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

        const result = await db.createDocument(
          DB_ID,
          ORDERS_COLLECTION_ID,
          id.unique(),
          orderData,
        );

        toast.success("¡Pedido realizado con éxito!");
        return { success: true, message: "Order created successfully", data: toOrder(result) };
      } catch (error: any) {
        console.error("Error creating order:", error);
        toast.error("Error al realizar el pedido. Inténtalo de nuevo.");
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const getMyOrders = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();

      const response = await db.listDocuments(
        DB_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal("userId", currentUser.$id),
          Query.orderDesc("$createdAt"),
        ],
      );

      return { success: true, message: "Orders fetched successfully", data: response.documents.map(toOrder) };
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return { success: false, message: error.message, data: [] };
    }
  }, []);

  const getOrderById = useCallback(
    async (orderId: string): Promise<HookResponse> => {
      try {
        const result = await db.getDocument(DB_ID, ORDERS_COLLECTION_ID, orderId);
        return { success: true, message: "Order fetched successfully", data: toOrder(result) };
      } catch (error: any) {
        console.error("Error fetching order:", error);
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<HookResponse> => {
      try {
        const result = await db.updateDocument(
          DB_ID,
          ORDERS_COLLECTION_ID,
          orderId,
          { status },
        );
        toast.success(`Estado del pedido actualizado a ${status}`);
        return { success: true, message: "Order status updated", data: toOrder(result) };
      } catch (error: any) {
        console.error("Error updating order:", error);
        toast.error("Error al actualizar el estado del pedido");
        return { success: false, message: error.message, data: null };
      }
    },
    [],
  );

  return { createOrder, getMyOrders, getOrderById, updateOrderStatus };
};

export default useOrders;
