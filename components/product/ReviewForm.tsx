"use client";
import { useState } from "react";
import useReviews from "@/hooks/useReviews";

interface ReviewFormProps {
  productId: string;
  onSubmitted?: () => void;
}

export default function ReviewForm({
  productId,
  onSubmitted,
}: ReviewFormProps) {
  const { addReview } = useReviews();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);
    const result = await addReview(productId, rating, content, title);
    setIsSubmitting(false);

    if (result.success) {
      setRating(5);
      setTitle("");
      setContent("");
      onSubmitted?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Write a Review</h4>

      {/* Star Rating */}
      <div className="rating-input">
        <label>Your Rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= (hoveredRating || rating) ? "filled" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="form-group">
        <label htmlFor="review-title">Review Title (optional)</label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      {/* Content */}
      <div className="form-group">
        <label htmlFor="review-content">Your Review *</label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          minLength={10}
          required
        />
        <span className="char-count">{content.length}/500</span>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting || content.trim().length < 10}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>

      <style jsx>{`
        .review-form {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
        }
        .review-form h4 {
          margin: 0 0 20px;
          font-size: 18px;
          font-weight: 600;
        }
        .rating-input {
          margin-bottom: 20px;
        }
        .rating-input label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .stars {
          display: flex;
          gap: 4px;
        }
        .star {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #ddd;
          transition:
            color 0.2s,
            transform 0.2s;
          padding: 0;
        }
        .star:hover {
          transform: scale(1.1);
        }
        .star.filled {
          color: #ffc107;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color, #000);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        .char-count {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        .submit-btn {
          width: 100%;
          padding: 14px 24px;
          background: var(--primary-color, #000);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
