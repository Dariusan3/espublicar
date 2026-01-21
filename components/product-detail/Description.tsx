"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useReviews from "@/hooks/useReviews";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Description({ productId }: { productId?: string }) {
  const { reviews, stats, isLoading, getProductReviews, addReview } =
    useReviews();
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (productId) {
      getProductReviews(productId);
    }
  }, [productId, getProductReviews]);

  const handleRatingChange = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Product not found");
      return;
    }

    // Basic validation
    if (!reviewForm.message.trim()) {
      toast.error("Please provide a review content");
      return;
    }

    // Call addReview
    await addReview(productId, reviewForm.rating, reviewForm.message);

    // Reset form on success (the hook handles success toast)
    setReviewForm((prev) => ({ ...prev, message: "" }));
  };
  return (
    <section className="tf-sp-4">
      <div className="container">
        <div className="flat-animate-tab flat-title-tab-product-des">
          <div className="flat-title-tab text-center">
            <ul className="menu-tab-line" role="tablist">
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-usually"
                  className="tab-link product-title fw-semibold active"
                  data-bs-toggle="tab"
                >
                  Usually Bought Together
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-des"
                  className="tab-link product-title fw-semibold"
                  data-bs-toggle="tab"
                >
                  Description
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-infor"
                  className="tab-link product-title fw-semibold"
                  data-bs-toggle="tab"
                >
                  Product information
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-review"
                  className="tab-link product-title fw-semibold"
                  data-bs-toggle="tab"
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            <div
              className="tab-pane active show"
              id="prd-usually"
              role="tabpanel"
            >
              <div className="tab-main tab-usually flex-md-wrap">
                <div className="card-usually hover-img">
                  <a href="#" className="image img-style">
                    <Image
                      src="/images/product/usually-buy-2.jpg"
                      alt=""
                      className="lazyload"
                      width={500}
                      height={500}
                    />
                  </a>
                  <div className="content">
                    <div className="checkbox-item-wrap">
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox-item"
                          defaultChecked={false}
                        />
                        <span className="btn-checkbox" />
                      </label>
                    </div>
                    <div className="box-name">
                      <a
                        href="#"
                        className="prd-name body-md-2 text-main link-secondary fw-semibold"
                      >
                        This item: Elite Gourmet EKT1001B Electric BPA-Free
                        Glass Kettle, Cordless 360°...
                      </a>
                      <p className="price-text fw-medium">$18.99</p>
                    </div>
                  </div>
                </div>
                <span className="icon">
                  <i className="icon-plus fs-28" />
                </span>
                <div className="card-usually hover-img">
                  <a href="#" className="image img-style">
                    <Image
                      src="/images/product/usually-buy-1.jpg"
                      alt=""
                      className="lazyload"
                      width={500}
                      height={500}
                    />
                  </a>
                  <div className="content">
                    <div className="checkbox-item-wrap">
                      <label>
                        <input type="checkbox" className="checkbox-item" />
                        <span className="btn-checkbox" />
                      </label>
                    </div>
                    <div className="box-name">
                      <a
                        href="#"
                        className="prd-name body-md-2 text-main link-secondary fw-semibold"
                      >
                        Rubbermaid No-Slip Large, Silverware Tray Organizer,
                        Black with Gray
                      </a>
                      <p className="price-text fw-medium">$8.29</p>
                    </div>
                  </div>
                </div>
                <div className="box-total-btn">
                  <p className="body-text-3 text-center">
                    Total price: <span className="text-primary">$27.29</span>
                  </p>
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="offcanvas"
                    className="tf-btn btn-line"
                  >
                    Add to cart
                    <i className="icon-cart-2" />
                  </a>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="prd-des" role="tabpanel">
              <div className="tab-main tab-des">
                <p className="body-text-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  tristique nisi id leo mollis egestas. Ut ac ante tincidunt
                  dolor viverra vestibulum. Fusce eget pharetra lorem.
                  Pellentesque ac feugiat nisi. Nulla sollicitudin cursus neque,
                  dapibus aliquet nulla congue congue. In eget sagittis metus,
                  nec semper tortor. Etiam in nunc dui. Sed nibh ante, maximus
                  eu commodo ac, mattis quis elit. Maecenas cursus libero et
                  risus sollicitudin mollis. Sed ultricies sagittis sem, vel
                  iaculis sapien dapibus non. Vivamus facilisis, diam et
                  condimentum sagittis, lectus enim iaculis ipsum, eu finibus
                  urna tellus sit amet ex. Aliquam eget rhoncus lorem. Duis ut
                  metus eget sapien lobortis varius id vel arcu. Sed hendrerit,
                  arcu eget ullamcorper efficitur, enim magna tempus erat, id
                  pretium libero ligula vitae tortor. Aliquam vehicula eleifend
                  sem nec maximus. Aenean ultricies ipsum et laoreet tincidunt.
                </p>
                <div className="image">
                  <Image
                    src="/images/product/description-1.jpg"
                    alt=""
                    className="lazyload"
                    width={900}
                    height={506}
                  />
                </div>
                <p className="body-text-3">
                  Morbi interdum purus id justo pellentesque feugiat. Sed
                  malesuada facilisis enim, volutpat ultrices nulla commodo ut.
                  Proin pulvinar pharetra lacinia. Nulla massa massa, elementum
                  vel gravida nec, fermentum vel risus. Cras eu ipsum id metus
                  sollicitudin scelerisque. Maecenas libero dui, faucibus vel
                  pharetra non, eleifend sit amet felis. Etiam metus nibh,
                  auctor non orci in, consectetur pretium enim
                </p>
                <div className="image">
                  <Image
                    src="/images/product/description-2.jpg"
                    alt=""
                    className="lazyload"
                    width={900}
                    height={506}
                  />
                </div>
                <p className="body-text-3">
                  Pellentesque quis efficitur leo. Maecenas accumsan est in nibh
                  interdum, quis dignissim neque scelerisque. Ut suscipit et leo
                  sit amet lacinia. Sed a laoreet leo, ut tristique risus.
                  Integer a est ut est semper fermentum nec quis nunc. Phasellus
                  aliquam neque eget quam gravida, quis venenatis turpis
                  tristique. Mauris id congue augue. Pellentesque hendrerit
                  porttitor purus, vel porttitor sem blandit vel. Ut auctor,
                  nibh tempus volutpat porttitor, urna ligula gravida lacus, non
                  mollis purus neque ac lorem. Morbi sodales convallis laoreet.
                  Mauris efficitur convallis odio sed congue.
                </p>
              </div>
            </div>
            <div className="tab-pane" id="prd-infor" role="tabpanel">
              <div className="tab-main tab-info">
                <ul className="list-feature">
                  <li>
                    <p className="name-feature">Package Dimensions</p>
                    <p className="property">8 x 8 x 6.7 inches</p>
                  </li>
                  <li>
                    <p className="name-feature">Item Weight</p>
                    <p className="property">2.2 pounds</p>
                  </li>
                  <li>
                    <p className="name-feature">Manufacturer</p>
                    <p className="property">Elite Gourmet</p>
                  </li>
                  <li>
                    <p className="name-feature">ASIN</p>
                    <p className="property">B09H3LWKYQ</p>
                  </li>
                  <li>
                    <p className="name-feature">Country of Origin</p>
                    <p className="property">China</p>
                  </li>
                  <li>
                    <p className="name-feature">Item model number</p>
                    <p className="property">EKT1001B</p>
                  </li>
                  <li>
                    <p className="name-feature">Customer Reviews</p>
                    <div className="w-100 star-review flex-wrap">
                      <ul className="list-star">
                        <li>
                          <i className="icon-star" />
                        </li>
                        <li>
                          <i className="icon-star" />
                        </li>
                        <li>
                          <i className="icon-star" />
                        </li>
                        <li>
                          <i className="icon-star" />
                        </li>
                        <li>
                          <i className="icon-star text-main-4" />
                        </li>
                      </ul>
                      <p className="caption text-main-2">Reviews (1.738)</p>
                    </div>
                  </li>
                  <li>
                    <p className="name-feature">Date First Available</p>
                    <p className="property">September 24, 2021</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-pane" id="prd-review" role="tabpanel">
              <div className="tab-main tab-review flex-lg-nowrap">
                <div className="tab-rating-wrap">
                  <div className="rating-percent">
                    <p className="rate-percent">
                      {stats ? stats.averageRating.toFixed(1) : "0.0"}{" "}
                      <span>/ 5</span>
                    </p>
                    <ul className="list-star justify-content-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <li key={s}>
                          <i
                            className={`icon-star ${s <= Math.round(stats?.averageRating || 0) ? "" : "text-third"}`}
                          />
                        </li>
                      ))}
                    </ul>
                    <p className="text-cl-3">
                      Based on {stats?.totalReviews || 0} reviews
                    </p>
                  </div>
                  <ul className="rating-progress-list">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <li key={rating}>
                        <p className="start-number body-text-3">
                          {rating}
                          <i className="icon-star text-third" />
                        </p>
                        <div className="rating-progress">
                          <div
                            className="progress style-2"
                            role="progressbar"
                            aria-valuenow={
                              stats?.ratingDistribution[rating] || 0
                            }
                            aria-valuemin={0}
                            aria-valuemax={stats?.totalReviews || 1}
                          >
                            <div
                              className="progress-bar"
                              style={{
                                width: `${stats?.totalReviews ? ((stats.ratingDistribution[rating] || 0) / stats.totalReviews) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                        <p className="count-review body-text-3">
                          {stats?.ratingDistribution[rating] || 0}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="add-comment-wrap">
                    <h5 className="fw-semibold">Add your review</h5>
                    <div>
                      <form
                        onSubmit={handleSubmitReview}
                        className="form-add-comment"
                      >
                        <fieldset className="rate">
                          <label>Rating:</label>
                          <ul className="list-star justify-content-start">
                            {[1, 2, 3, 4, 5].map((currRating) => (
                              <li
                                key={currRating}
                                onClick={() => handleRatingChange(currRating)}
                                style={{ cursor: "pointer" }}
                              >
                                <i
                                  className={`icon-star ${currRating <= reviewForm.rating ? "" : "text-third"}`}
                                />
                              </li>
                            ))}
                          </ul>
                        </fieldset>
                        <fieldset className="align-items-sm-start">
                          <label>Review:</label>
                          <textarea
                            placeholder="Write your review here"
                            required
                            value={reviewForm.message}
                            onChange={(e) =>
                              setReviewForm((prev) => ({
                                ...prev,
                                message: e.target.value,
                              }))
                            }
                          />
                        </fieldset>
                        <div className="btn-submit">
                          <button
                            type="submit"
                            className="tf-btn btn-gray btn-large-2"
                          >
                            <span className="text-white">Submit Review</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="tab-review-wrap">
                  {isLoading ? (
                    <div className="text-center p-5">Loading reviews...</div>
                  ) : reviews.length > 0 ? (
                    <ul className="review-list">
                      {reviews.map((review) => (
                        <li key={review.id} className="box-review">
                          <div className="avt">
                            <Image
                              alt="User Avatar"
                              src={"/images/avatar/user.jpg"}
                              width={100}
                              height={100}
                              className="rounded-circle"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="review-content">
                            <div className="author-wrap">
                              <h6 className="name fw-semibold">
                                <a href="#" className="link">
                                  {review.userName || "User"}
                                </a>
                              </h6>
                              {review.verified && (
                                <ul className="verified">
                                  <li className="body-small fw-semibold text-main-2">
                                    Verified Purchase
                                  </li>
                                </ul>
                              )}
                              <ul className="list-star">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <li key={s}>
                                    <i
                                      className={`icon-star ${s <= review.rating ? "" : "text-third"}`}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="text-review">{review.content}</p>
                            <p className="date-review body-small">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-5">
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
