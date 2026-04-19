"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, Query } from "@/lib/appwrite";
import { HookResponse, Product, User } from "@/types/Types";
import { toProduct, toUser, toReview } from "@/helpers/dbHelpers";

export interface SellerProfile {
  user: User;
  listings: Product[];
  totalListings: number;
  averageRating: number;
  totalReviews: number;
  joinedDate: string;
}

const useSeller = () => {
  const [loading, setLoading] = useState(false);

  const getSellerProfile = useCallback(
    async (sellerId: string): Promise<HookResponse> => {
      setLoading(true);
      try {
        const [userRes, productsRes] = await Promise.all([
          db.getDocument(DB_ID, COLLECTIONS.USERS, sellerId),
          db.listDocuments(DB_ID, COLLECTIONS.PRODUCTS, [
            Query.equal("userId", sellerId),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]),
        ]);

        const user = toUser(userRes);
        const listings = productsRes.documents.map(toProduct);

        const productIds = listings.map((p) => String(p.id));
        let averageRating = 0;
        let totalReviews = 0;

        if (productIds.length > 0) {
          try {
            const reviewsRes = await db.listDocuments(
              DB_ID,
              COLLECTIONS.REVIEWS,
              [Query.equal("productId", productIds), Query.limit(500)],
            );
            const reviews = reviewsRes.documents.map(toReview);
            totalReviews = reviews.length;
            if (totalReviews > 0) {
              averageRating =
                reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
            }
          } catch (e: any) {
            if (e?.code !== 404) throw e;
            // Reviews collection not created yet — skip silently
          }
        }

        const profile: SellerProfile = {
          user,
          listings,
          totalListings: productsRes.total,
          averageRating,
          totalReviews,
          joinedDate: user.createdAt,
        };

        return { success: true, message: "Seller profile fetched", data: profile };
      } catch (error: any) {
        console.error("Error fetching seller profile:", error);
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, getSellerProfile };
};

export default useSeller;
