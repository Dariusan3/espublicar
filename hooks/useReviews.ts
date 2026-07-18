"use client";
import { useCallback, useState } from "react";
import { db, DB_ID, COLLECTIONS, Query, ID, account } from "@/lib/supabase";
import { toast } from "react-toastify";

import { HookResponse, Review } from "@/types/Types";
export type { Review };

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

/**
 * Custom hook for product reviews
 */
const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Convert Supabase row to Review type
   */
  const toReview = (doc: any): Review => ({
    id: doc.id,
    productId: doc.productId,
    userId: doc.userId,
    userName: doc.userName,
    rating: doc.rating,
    title: doc.title || "",
    content: doc.content,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    verified: doc.verified || false,
  });

  /**
   * Get reviews for a product
   */
  const getProductReviews = useCallback(
    async (productId: string): Promise<HookResponse> => {
      setIsLoading(true);
      try {
        const response = await db.listDocuments(DB_ID, COLLECTIONS.REVIEWS, [
          Query.equal("productId", productId),
          Query.orderDesc("$createdAt"),
        ]);

        const reviewList = response.documents.map(toReview);
        setReviews(reviewList);

        // Calculate stats
        const totalReviews = reviewList.length;
        const ratingDistribution: { [key: number]: number } = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };
        let totalRating = 0;

        reviewList.forEach((review) => {
          totalRating += review.rating;
          ratingDistribution[review.rating] =
            (ratingDistribution[review.rating] || 0) + 1;
        });

        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        const reviewStats: ReviewStats = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution,
        };
        setStats(reviewStats);

        return {
          success: true,
          message: "Reviews fetched successfully",
          data: { reviews: reviewList, stats: reviewStats },
        };
      } catch (error: any) {
        if (error?.code === 404) {
          const emptyStats: ReviewStats = {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };
          setReviews([]);
          setStats(emptyStats);
          return {
            success: true,
            message: "Collection not found",
            data: { reviews: [], stats: emptyStats },
          };
        }
        console.error("Error fetching reviews:", error);
        return {
          success: false,
          message: error.message,
          data: null,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Add a new review
   */
  const addReview = useCallback(
    async (
      productId: string,
      rating: number,
      content: string,
      title?: string,
    ): Promise<HookResponse> => {
      try {
        const currentUser = await account.get();

        // Check if user already reviewed this product
        const existingReviews = await db.listDocuments(
          DB_ID,
          COLLECTIONS.REVIEWS,
          [
            Query.equal("productId", productId),
            Query.equal("userId", currentUser.$id),
          ],
        );

        if (existingReviews.total > 0) {
          toast.warning("You've already reviewed this product");
          return {
            success: false,
            message: "Already reviewed",
            data: null,
          };
        }

        const reviewData = {
          productId,
          userId: currentUser.$id,
          userName: currentUser.name || "Anonymous",
          rating,
          title: title || "",
          content,
          verified: false,
        };

        const result = await db.createDocument(
          DB_ID,
          COLLECTIONS.REVIEWS,
          ID.unique(),
          reviewData,
        );

        const newReview = toReview(result);
        setReviews((prev) => [newReview, ...prev]);

        toast.success("Review submitted successfully! 🎉");

        return {
          success: true,
          message: "Review added successfully",
          data: newReview,
        };
      } catch (error: any) {
        console.error("Error adding review:", error);
        toast.error("Failed to submit review");
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
   * Update an existing review
   */
  const updateReview = useCallback(
    async (
      reviewId: string,
      rating: number,
      content: string,
      title?: string,
    ): Promise<HookResponse> => {
      try {
        const result = await db.updateDocument(
          DB_ID,
          COLLECTIONS.REVIEWS,
          reviewId,
          { rating, content, title: title || "" },
        );

        const updatedReview = toReview(result);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? updatedReview : r)),
        );

        toast.success("Review updated!");

        return {
          success: true,
          message: "Review updated successfully",
          data: updatedReview,
        };
      } catch (error: any) {
        console.error("Error updating review:", error);
        toast.error("Failed to update review");
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
   * Delete a review
   */
  const deleteReview = useCallback(
    async (reviewId: string): Promise<HookResponse> => {
      try {
        await db.deleteDocument(DB_ID, COLLECTIONS.REVIEWS, reviewId);

        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        toast.success("Review deleted");

        return {
          success: true,
          message: "Review deleted successfully",
          data: null,
        };
      } catch (error: any) {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review");
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
   * Check if user can review a product
   */
  const canUserReview = useCallback(
    async (productId: string): Promise<boolean> => {
      try {
        const currentUser = await account.get();
        const existingReviews = await db.listDocuments(
          DB_ID,
          COLLECTIONS.REVIEWS,
          [
            Query.equal("productId", productId),
            Query.equal("userId", currentUser.$id),
          ],
        );
        return existingReviews.total === 0;
      } catch {
        return false;
      }
    },
    [],
  );

  return {
    // State
    reviews,
    stats,
    isLoading,

    // Actions
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    canUserReview,
  };
};

export default useReviews;
