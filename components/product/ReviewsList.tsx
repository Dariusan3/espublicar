"use client";
import { useEffect, useState } from "react";
import useReviews, { Review, ReviewStats } from "@/hooks/useReviews";
import ReviewForm from "./ReviewForm";

interface ReviewsListProps {
  productId: string;
  showForm?: boolean;
}

export default function ReviewsList({
  productId,
  showForm = true,
}: ReviewsListProps) {
  const { reviews, stats, isLoading, getProductReviews, canUserReview } =
    useReviews();
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    getProductReviews(productId);
    canUserReview(productId).then(setCanReview);
  }, [productId, getProductReviews, canUserReview]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    getProductReviews(productId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="reviews-loading">
        <div className="spinner" />
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* Stats Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{stats.averageRating}</span>
            {renderStars(Math.round(stats.averageRating))}
            <span className="total-reviews">
              Based on {stats.totalReviews} review
              {stats.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = stats.ratingDistribution[num] || 0;
              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={num} className="rating-bar-row">
                  <span className="bar-label">{num} ★</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write Review Button/Form */}
      {showForm && canReview && !showReviewForm && (
        <button
          className="write-review-btn"
          onClick={() => setShowReviewForm(true)}
        >
          ✍️ Write a Review
        </button>
      )}

      {showForm && showReviewForm && (
        <ReviewForm productId={productId} onSubmitted={handleReviewSubmitted} />
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review: Review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.userName}</span>
                  {review.verified && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                </div>
                <span className="review-date">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <div className="review-rating">{renderStars(review.rating)}</div>
              {review.title && <h5 className="review-title">{review.title}</h5>}
              <p className="review-content">{review.content}</p>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .reviews-section {
          padding: 30px 0;
        }
        .reviews-loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #eee;
          border-top-color: var(--primary-color, #000);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 15px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .reviews-summary {
          display: flex;
          gap: 40px;
          padding: 24px;
          background: #f9f9f9;
          border-radius: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .average-rating {
          text-align: center;
        }
        .rating-number {
          display: block;
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
        }
        .stars-display {
          margin: 8px 0;
        }
        .star {
          font-size: 18px;
          color: #ddd;
        }
        .star.filled {
          color: #ffc107;
        }
        .total-reviews {
          font-size: 13px;
          color: #666;
        }
        .rating-bars {
          flex: 1;
          min-width: 200px;
        }
        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .bar-label {
          width: 40px;
          font-size: 13px;
        }
        .bar-track {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: #ffc107;
          border-radius: 4px;
        }
        .bar-count {
          width: 30px;
          text-align: right;
          font-size: 13px;
          color: #666;
        }
        .write-review-btn {
          display: block;
          width: 100%;
          padding: 16px;
          background: #fff;
          border: 2px dashed #ddd;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 24px;
          transition: all 0.2s;
        }
        .write-review-btn:hover {
          border-color: var(--primary-color, #000);
          background: #f9f9f9;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .no-reviews {
          text-align: center;
          padding: 40px;
          color: #666;
          background: #f9f9f9;
          border-radius: 12px;
        }
        .review-card {
          padding: 20px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .reviewer-name {
          font-weight: 600;
        }
        .verified-badge {
          font-size: 11px;
          color: #28a745;
          background: #e6f7e9;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .review-date {
          font-size: 13px;
          color: #999;
        }
        .review-rating {
          margin-bottom: 10px;
        }
        .review-title {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 600;
        }
        .review-content {
          margin: 0;
          color: #555;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
