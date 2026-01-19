"use client";
import { useCallback } from "react";
import {
  db,
  DB_ID,
  CARTS_COLLECTION_ID,
  id,
  Query,
  COLLECTIONS,
} from "@/lib/appwrite";
import { CartDB, HookResponse } from "@/types/Types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setCart,
  addToCart as addToCartAction,
  removeFromCart,
  updateQuantity,
  clearCart as clearCartAction,
} from "@/store/slices/cartSlice";
import { toCart } from "@/helpers/dbHelpers";
import { toast } from "react-toastify";

/**
 * Custom hook for cart operations with Appwrite and Redux
 */
const useCart = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);

  /**
   * Fetch current user's cart from Appwrite
   */
  const getMyCart = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();

      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: CARTS_COLLECTION_ID,
        queries: [Query.equal("userId", currentUser.$id)],
      });

      // Fetch product details for each cart item
      const cartItemsWithDetails = await Promise.all(
        response.documents.map(async (doc) => {
          const cartItem = toCart(doc);
          try {
            const productDoc = await db.getDocument({
              databaseId: DB_ID,
              collectionId: COLLECTIONS.PRODUCTS,
              documentId: cartItem.productId,
            });
            return {
              ...cartItem,
              productTitle: productDoc.title,
              productPrice: productDoc.price,
              productImage: productDoc.imgSrc,
            };
          } catch (e) {
            console.error(`Error fetching product ${cartItem.productId}:`, e);
            return cartItem;
          }
        }),
      );

      dispatch(setCart(cartItemsWithDetails as any));

      return {
        success: true,
        message: "Cart fetched successfully",
        data: cartItemsWithDetails,
      };
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, [dispatch]);

  /**
   * Add item to cart
   */
  const addCartItem = useCallback(
    async (productId: string, quantity: number = 1): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/appwrite");
        const currentUser = await account.get();

        // Check if item already exists in cart
        const existingItems = await db.listDocuments({
          databaseId: DB_ID,
          collectionId: CARTS_COLLECTION_ID,
          queries: [
            Query.equal("userId", currentUser.$id),
            Query.equal("productId", productId),
          ],
        });

        let result;
        if (existingItems.documents.length > 0) {
          // Update existing item quantity
          const existingItem = existingItems.documents[0];
          const newQuantity = existingItem.quantity + quantity;

          result = await db.updateDocument({
            databaseId: DB_ID,
            collectionId: CARTS_COLLECTION_ID,
            documentId: existingItem.$id,
            data: { quantity: newQuantity },
          });
        } else {
          // Create new cart item
          const cartData: CartDB = {
            userId: currentUser.$id,
            productId,
            quantity,
          };

          result = await db.createDocument({
            databaseId: DB_ID,
            collectionId: CARTS_COLLECTION_ID,
            documentId: id.unique(),
            data: cartData,
          });
        }

        // Fetch product details for the added/updated item
        const productDoc = await db.getDocument({
          databaseId: DB_ID,
          collectionId: COLLECTIONS.PRODUCTS,
          documentId: productId,
        });

        const cartItem = {
          ...toCart(result),
          productTitle: productDoc.title,
          productPrice: productDoc.price,
          productImage: productDoc.imgSrc,
        };

        dispatch(addToCartAction(cartItem as any));

        toast.success("🛒 Item added to cart!");

        return {
          success: true,
          message: "Item added to cart",
          data: cartItem,
        };
      } catch (error: any) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
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
   * Remove item from cart
   */
  const removeCartItem = useCallback(
    async (cartItemId: string): Promise<HookResponse> => {
      try {
        await db.deleteDocument({
          databaseId: DB_ID,
          collectionId: CARTS_COLLECTION_ID,
          documentId: cartItemId,
        });

        dispatch(removeFromCart(cartItemId));
        toast.success("Item removed from cart");

        return {
          success: true,
          message: "Item removed from cart",
          data: null,
        };
      } catch (error: any) {
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove item from cart");
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
   * Update cart item quantity
   */
  const updateCartItemQuantity = useCallback(
    async (cartItemId: string, quantity: number): Promise<HookResponse> => {
      try {
        if (quantity <= 0) {
          return removeCartItem(cartItemId);
        }

        const result = await db.updateDocument({
          databaseId: DB_ID,
          collectionId: CARTS_COLLECTION_ID,
          documentId: cartItemId,
          data: { quantity },
        });

        dispatch(updateQuantity({ id: cartItemId, quantity }));

        return {
          success: true,
          message: "Cart updated",
          data: result,
        };
      } catch (error: any) {
        console.error("Error updating cart quantity:", error);
        toast.error("Failed to update cart");
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
    },
    [dispatch, removeCartItem],
  );

  /**
   * Clear all cart items
   */
  const clearMyCart = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/appwrite");
      const currentUser = await account.get();

      // Get all user's cart items
      const response = await db.listDocuments({
        databaseId: DB_ID,
        collectionId: CARTS_COLLECTION_ID,
        queries: [Query.equal("userId", currentUser.$id)],
      });

      // Delete all items
      await Promise.all(
        response.documents.map((doc) =>
          db.deleteDocument({
            databaseId: DB_ID,
            collectionId: CARTS_COLLECTION_ID,
            documentId: doc.$id,
          }),
        ),
      );

      dispatch(clearCartAction());
      toast.success("Cart cleared");

      return {
        success: true,
        message: "Cart cleared",
        data: null,
      };
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }, [dispatch]);

  return {
    // State
    cart: cartState,

    // Actions
    getMyCart,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearMyCart,
  };
};

export default useCart;
