"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, Query } from "@/lib/supabase";
import { HookResponse } from "@/types/Types";
import {
  toProduct,
  toProducts,
  toUser,
  toUsers,
  toOrder,
  toOrders,
} from "@/helpers/dbHelpers";

const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const getAllProducts = useCallback(
    async (
      filters?: { search?: string; status?: string },
      limit = 25,
      offset = 0,
    ): Promise<HookResponse> => {
      setLoading(true);
      try {
        const baseQueries = [
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
          Query.offset(offset),
        ];

        let response;
        let needClientFilter = false;
        try {
          const queries = [...baseQueries];
          if (filters?.search) {
            queries.push(Query.search("title", filters.search));
          }
          response = await db.listDocuments(DB_ID, COLLECTIONS.PRODUCTS, queries);
        } catch (err: any) {
          if (
            err?.type === "index_not_found" ||
            /fulltext index/i.test(err?.message || "")
          ) {
            needClientFilter = true;
            response = await db.listDocuments(
              DB_ID,
              COLLECTIONS.PRODUCTS,
              baseQueries,
            );
          } else {
            throw err;
          }
        }

        let products = toProducts(response.documents);
        let total = response.total;

        if (needClientFilter && filters?.search) {
          const q = filters.search.toLowerCase();
          products = products.filter((p) =>
            (p.title || "").toLowerCase().includes(q),
          );
          total = products.length;
        }

        return {
          success: true,
          message: "Products fetched",
          data: { products, total },
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (productId: string, data: Record<string, any>): Promise<HookResponse> => {
      try {
        const result = await db.updateDocument(DB_ID, COLLECTIONS.PRODUCTS, productId, data);
        return { success: true, message: "Product updated", data: toProduct(result) };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const deleteProduct = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        await db.deleteDocument(DB_ID, COLLECTIONS.PRODUCTS, productId);
        return { success: true, message: "Product deleted" };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const getAllUsers = useCallback(
    async (limit = 25, offset = 0): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(DB_ID, COLLECTIONS.USERS, [
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
          Query.offset(offset),
        ]);
        return {
          success: true,
          message: "Users fetched",
          data: { users: toUsers(response.documents), total: response.total },
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getAllOrders = useCallback(
    async (limit = 25, offset = 0): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
          Query.offset(offset),
        ]);
        return {
          success: true,
          message: "Orders fetched",
          data: { orders: toOrders(response.documents), total: response.total },
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<HookResponse> => {
      try {
        const result = await db.updateDocument(DB_ID, COLLECTIONS.ORDERS, orderId, { status });
        return { success: true, message: "Order status updated", data: toOrder(result) };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [],
  );

  const getAdminStats = useCallback(async (): Promise<HookResponse> => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        db.listDocuments(DB_ID, COLLECTIONS.PRODUCTS, [Query.limit(1)]),
        db.listDocuments(DB_ID, COLLECTIONS.USERS, [Query.limit(1)]),
        db.listDocuments(DB_ID, COLLECTIONS.ORDERS, [Query.limit(500)]),
      ]);
      const orders = toOrders(ordersRes.documents);
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        success: true,
        message: "Stats fetched",
        data: {
          totalProducts: productsRes.total,
          totalUsers: usersRes.total,
          totalOrders: ordersRes.total,
          totalRevenue,
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }, []);

  return {
    loading,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getAdminStats,
  };
};

export default useAdmin;
