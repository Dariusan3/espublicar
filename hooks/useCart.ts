"use client";
import { useCallback } from "react";
import {
  db,
  DB_ID,
  CARTS_COLLECTION_ID,
  id,
  Query,
  COLLECTIONS,
} from "@/lib/supabase";
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

const useCart = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);

  const getMyCart = useCallback(async (): Promise<HookResponse> => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        dispatch(setCart([]));
        return { success: true, message: "No session", data: [] };
      }
      const currentUser = session.user;

      const response = await db.listDocuments(
        DB_ID,
        CARTS_COLLECTION_ID,
        [Query.equal("userId", currentUser.id)],
      );

      const cartItemsWithDetails = await Promise.all(
        response.documents.map(async (doc) => {
          const cartItem = toCart(doc);
          try {
            const productDoc = await db.getDocument(
              DB_ID,
              COLLECTIONS.PRODUCTS,
              cartItem.productId,
            );
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
      return { success: true, message: "Cart fetched successfully", data: cartItemsWithDetails };
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      return { success: false, message: error.message, data: null };
    }
  }, [dispatch]);

  const addCartItem = useCallback(
    async (productId: string, quantity: number = 1): Promise<HookResponse> => {
      try {
        const { account } = await import("@/lib/supabase");
        const currentUser = await account.get();

        const existingItems = await db.listDocuments(
          DB_ID,
          CARTS_COLLECTION_ID,
          [
            Query.equal("userId", currentUser.$id),
            Query.equal("productId", productId),
          ],
        );

        let result;
        if (existingItems.documents.length > 0) {
          const existingItem = existingItems.documents[0];
          result = await db.updateDocument(
            DB_ID,
            CARTS_COLLECTION_ID,
            existingItem.$id,
            { quantity: existingItem.quantity + quantity },
          );
        } else {
          const cartData: CartDB = { userId: currentUser.$id, productId, quantity };
          result = await db.createDocument(
            DB_ID,
            CARTS_COLLECTION_ID,
            id.unique(),
            cartData,
          );
        }

        const productDoc = await db.getDocument(
          DB_ID,
          COLLECTIONS.PRODUCTS,
          productId,
        );

        const cartItem = {
          ...toCart(result),
          productTitle: productDoc.title,
          productPrice: productDoc.price,
          productImage: productDoc.imgSrc,
        };

        dispatch(addToCartAction(cartItem as any));
        toast.success("Añadido al carrito");

        return { success: true, message: "Item added to cart", data: cartItem };
      } catch (error: any) {
        console.error("Error adding to cart:", error);
        toast.error("Error al añadir al carrito");
        return { success: false, message: error.message, data: null };
      }
    },
    [dispatch],
  );

  const removeCartItem = useCallback(
    async (cartItemId: string): Promise<HookResponse> => {
      try {
        await db.deleteDocument(DB_ID, CARTS_COLLECTION_ID, cartItemId);
        dispatch(removeFromCart(cartItemId));
        toast.success("Eliminado del carrito");
        return { success: true, message: "Item removed from cart", data: null };
      } catch (error: any) {
        console.error("Error removing from cart:", error);
        toast.error("Error al eliminar del carrito");
        return { success: false, message: error.message, data: null };
      }
    },
    [dispatch],
  );

  const updateCartItemQuantity = useCallback(
    async (cartItemId: string, quantity: number): Promise<HookResponse> => {
      try {
        if (quantity <= 0) {
          return removeCartItem(cartItemId);
        }
        const result = await db.updateDocument(
          DB_ID,
          CARTS_COLLECTION_ID,
          cartItemId,
          { quantity },
        );
        dispatch(updateQuantity({ id: cartItemId, quantity }));
        return { success: true, message: "Cart updated", data: result };
      } catch (error: any) {
        console.error("Error updating cart quantity:", error);
        toast.error("Error al actualizar el carrito");
        return { success: false, message: error.message, data: null };
      }
    },
    [dispatch, removeCartItem],
  );

  const clearMyCart = useCallback(async (): Promise<HookResponse> => {
    try {
      const { account } = await import("@/lib/supabase");
      const currentUser = await account.get();

      const response = await db.listDocuments(
        DB_ID,
        CARTS_COLLECTION_ID,
        [Query.equal("userId", currentUser.$id)],
      );

      await Promise.all(
        response.documents.map((doc) =>
          db.deleteDocument(DB_ID, CARTS_COLLECTION_ID, doc.$id),
        ),
      );

      dispatch(clearCartAction());
      toast.success("Carrito vaciado");
      return { success: true, message: "Cart cleared", data: null };
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Error al vaciar el carrito");
      return { success: false, message: error.message, data: null };
    }
  }, [dispatch]);

  return {
    cart: cartState,
    getMyCart,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearMyCart,
  };
};

export default useCart;
