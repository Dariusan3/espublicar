"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, ID, Query } from "@/lib/appwrite";
import { HookResponse, Offer } from "@/types/Types";
import { toOffer, toOffers } from "@/helpers/dbHelpers";

const useOffers = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Make an offer on a product
   */
  const makeOffer = useCallback(
    async (
      productId: string,
      buyerId: string,
      sellerId: string,
      amount: number,
      message?: string,
    ): Promise<HookResponse> => {
      try {
        // Check if buyer already has a pending offer on this product
        const existing = await db.listDocuments(
          DB_ID,
          COLLECTIONS.OFFERS,
          [
            Query.equal("productId", productId),
            Query.equal("buyerId", buyerId),
            Query.equal("status", "pending"),
          ],
        );

        if (existing.total > 0) {
          return {
            success: false,
            message: "Ya tienes una oferta pendiente en este producto",
          };
        }

        const offerData = {
          productId,
          buyerId,
          sellerId,
          amount,
          status: "pending",
          message: message || "",
        };

        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.OFFERS,
          ID.unique(),
          offerData,
        );

        return {
          success: true,
          message: "Oferta enviada",
          data: toOffer(result),
        };
      } catch (error: any) {
        console.error("Error making offer:", error);
        return { success: false, message: error.message };
      }
    },
    [],
  );

  /**
   * Get all offers for a specific product (seller view)
   */
  const getOffersForProduct = useCallback(
    async (productId: string): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.OFFERS,
          [
            Query.equal("productId", productId),
            Query.orderDesc("$createdAt"),
          ],
        );

        return {
          success: true,
          message: "Offers fetched",
          data: toOffers(response.documents),
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Get all offers sent by a buyer
   */
  const getMyOffers = useCallback(
    async (userId: string): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.OFFERS,
          [
            Query.equal("buyerId", userId),
            Query.orderDesc("$createdAt"),
          ],
        );

        return {
          success: true,
          message: "My offers fetched",
          data: toOffers(response.documents),
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Get all offers received by a seller
   */
  const getOffersForSeller = useCallback(
    async (sellerId: string): Promise<HookResponse> => {
      setLoading(true);
      try {
        const response = await db.listDocuments(
          DB_ID,
          COLLECTIONS.OFFERS,
          [
            Query.equal("sellerId", sellerId),
            Query.orderDesc("$createdAt"),
          ],
        );

        return {
          success: true,
          message: "Seller offers fetched",
          data: toOffers(response.documents),
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Respond to an offer (accept, reject, or counter)
   */
  const respondToOffer = useCallback(
    async (
      offerId: string,
      status: "accepted" | "rejected" | "countered",
      counterAmount?: number,
    ): Promise<HookResponse> => {
      try {
        const updateData: any = { status };
        if (status === "countered" && counterAmount !== undefined) {
          updateData.counterAmount = counterAmount;
        }

        const result = await db.updateDocument(
          DB_ID,
          COLLECTIONS.OFFERS,
          offerId,
          updateData,
        );

        return {
          success: true,
          message:
            status === "accepted"
              ? "Oferta aceptada"
              : status === "rejected"
                ? "Oferta rechazada"
                : "Contraoferta enviada",
          data: toOffer(result),
        };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [],
  );

  return {
    loading,
    makeOffer,
    getOffersForProduct,
    getMyOffers,
    getOffersForSeller,
    respondToOffer,
  };
};

export default useOffers;
