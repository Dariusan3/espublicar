"use client";
import { useCallback } from "react";
import { db, DB_ID, WISHLISTS_COLLECTION_ID, id, Query } from "@/lib/appwrite";
import { WishlistDB, HookResponse } from "@/types/Types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setWishlist,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  clearWishlist as clearWishlistAction,
} from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";

const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistState = useAppSelector((state) => state.wishlist);

  const getMyWishlist = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();
      const response = await db.listDocuments(
        DB_ID,
        WISHLISTS_COLLECTION_ID,
        [Query.equal("userId", currentUser.$id)],
      );
      const productIds = response.documents.map((doc) => doc.productId);
      dispatch(setWishlist(productIds));
      return { success: true, message: "Wishlist fetched successfully", data: productIds };
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      return { success: false, message: error.message, data: null };
    }
  }, [dispatch]);

  const addToWishlist = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/appwrite");
        const currentUser = await account.get();

        const existing = await db.listDocuments(
          DB_ID,
          WISHLISTS_COLLECTION_ID,
          [
            Query.equal("userId", currentUser.$id),
            Query.equal("productId", productId),
          ],
        );

        if (existing.documents.length > 0) {
          toast.info("Ya está en favoritos");
          return { success: true, message: "Item already in wishlist", data: null };
        }

        const wishlistData: WishlistDB = { userId: currentUser.$id, productId };
        await db.createDocument(
          DB_ID,
          WISHLISTS_COLLECTION_ID,
          id.unique(),
          wishlistData,
        );

        dispatch(addToWishlistAction(productId));
        toast.success("Añadido a favoritos");
        return { success: true, message: "Added to wishlist", data: productId };
      } catch (error: any) {
        console.error("Error adding to wishlist:", error);
        toast.error("Error al añadir a favoritos");
        return { success: false, message: error.message, data: null };
      }
    },
    [dispatch],
  );

  const removeFromWishlist = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/appwrite");
        const currentUser = await account.get();

        const response = await db.listDocuments(
          DB_ID,
          WISHLISTS_COLLECTION_ID,
          [
            Query.equal("userId", currentUser.$id),
            Query.equal("productId", productId),
          ],
        );

        if (response.documents.length === 0) {
          return { success: false, message: "Item not in wishlist", data: null };
        }

        await db.deleteDocument(DB_ID, WISHLISTS_COLLECTION_ID, response.documents[0].$id);
        dispatch(removeFromWishlistAction(productId));
        toast.success("Eliminado de favoritos");
        return { success: true, message: "Removed from wishlist", data: null };
      } catch (error: any) {
        console.error("Error removing from wishlist:", error);
        toast.error("Error al eliminar de favoritos");
        return { success: false, message: error.message, data: null };
      }
    },
    [dispatch],
  );

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistState.items.includes(productId);
    },
    [wishlistState.items],
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<HookResponse> => {
      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      } else {
        return addToWishlist(productId);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist],
  );

  const clearMyWishlist = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();
      const response = await db.listDocuments(
        DB_ID,
        WISHLISTS_COLLECTION_ID,
        [Query.equal("userId", currentUser.$id)],
      );
      await Promise.all(
        response.documents.map((doc) =>
          db.deleteDocument(DB_ID, WISHLISTS_COLLECTION_ID, doc.$id),
        ),
      );
      dispatch(clearWishlistAction());
      toast.success("Favoritos vaciados");
      return { success: true, message: "Wishlist cleared", data: null };
    } catch (error: any) {
      console.error("Error clearing wishlist:", error);
      toast.error("Error al vaciar favoritos");
      return { success: false, message: error.message, data: null };
    }
  }, [dispatch]);

  return {
    wishlist: wishlistState,
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearMyWishlist,
  };
};

export default useWishlist;
