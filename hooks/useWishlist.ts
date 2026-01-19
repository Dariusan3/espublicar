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

/**
 * Custom hook for wishlist operations with Appwrite and Redux
 */
const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistState = useAppSelector((state) => state.wishlist);

  /**
   * Fetch current user's wishlist from Appwrite
   */
  const getMyWishlist = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();

      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: WISHLISTS_COLLECTION_ID,
        queries: [Query.equal("userId", currentUser.$id)],
      });

      const productIds = response.documents.map((doc) => doc.productId);
      dispatch(setWishlist(productIds));

      return {
        success: true,
        message: "Wishlist fetched successfully",
        data: productIds,
      };
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, [dispatch]);

  /**
   * Add product to wishlist
   */
  const addToWishlist = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/appwrite");
        const currentUser = await account.get();

        // Check if already in wishlist
        const existing = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: WISHLISTS_COLLECTION_ID,
          queries: [
            Query.equal("userId", currentUser.$id),
            Query.equal("productId", productId),
          ],
        });

        if (existing.documents.length > 0) {
          toast.info("Item already in wishlist");
          return {
            success: true,
            message: "Item already in wishlist",
            data: null,
          };
        }

        const wishlistData: WishlistDB = {
          userId: currentUser.$id,
          productId,
        };

        await db.createDocument({
          databaseId: DB_ID,
          collectionId: WISHLISTS_COLLECTION_ID,
          documentId: id.unique(),
          data: wishlistData,
        });

        dispatch(addToWishlistAction(productId));
        toast.success("❤️ Added to wishlist!");

        return {
          success: true,
          message: "Added to wishlist",
          data: productId,
        };
      } catch (error: any) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist");
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [dispatch],
  );

  /**
   * Remove product from wishlist
   */
  const removeFromWishlist = useCallback(
    async (productId: string): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/appwrite");
        const currentUser = await account.get();

        // Find the wishlist document
        const response = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: WISHLISTS_COLLECTION_ID,
          queries: [
            Query.equal("userId", currentUser.$id),
            Query.equal("productId", productId),
          ],
        });

        if (response.documents.length === 0) {
          return {
            success: false,
            message: "Item not in wishlist",
            data: null,
          };
        }

        // Delete the wishlist item
        await db.deleteDocument({
          databaseId: DB_ID,
          collectionId: WISHLISTS_COLLECTION_ID,
          documentId: response.documents[0].$id,
        });

        dispatch(removeFromWishlistAction(productId));
        toast.success("Removed from wishlist");

        return {
          success: true,
          message: "Removed from wishlist",
          data: null,
        };
      } catch (error: any) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist");
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [dispatch],
  );

  /**
   * Check if a product is in the wishlist
   */
  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistState.items.includes(productId);
    },
    [wishlistState.items],
  );

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
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

  /**
   * Clear entire wishlist
   */
  const clearMyWishlist = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();

      // Get all user's wishlist items
      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: WISHLISTS_COLLECTION_ID,
        queries: [Query.equal("userId", currentUser.$id)],
      });

      // Delete all items
      await Promise.all(
        response.documents.map((doc) =>
          db.deleteDocument({
            databaseId: DB_ID,
            collectionId: WISHLISTS_COLLECTION_ID,
            documentId: doc.$id,
          }),
        ),
      );

      dispatch(clearWishlistAction());
      toast.success("Wishlist cleared");

      return {
        success: true,
        message: "Wishlist cleared",
        data: null,
      };
    } catch (error: any) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, [dispatch]);

  return {
    // State
    wishlist: wishlistState,

    // Actions
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearMyWishlist,
  };
};

export default useWishlist;
