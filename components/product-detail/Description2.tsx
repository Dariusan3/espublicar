"use client";
import React from "react";
import Image from "next/image";
import ReviewsList from "../product/ReviewsList";

interface Description2Props {
  productId?: string;
}

export default function Description2({ productId = "1" }: Description2Props) {
  return (
    <section className="tf-sp-4">
      <div className="container">
        <div className="flat-product-des-list">
          {/* Usually Bought Together - Keeping static for now as it's complex logic */}
          <div className="flat-title-tab-product-des">
            <div className="flat-title-tab">
              <ul className="menu-tab-line">
                <li className="nav-tab-item">
                  <p className="product-title fw-semibold">Description</p>
                </li>
              </ul>
            </div>
            <div className="tab-main tab-des">
              <p className="body-text-3">
                Experience premium quality with this meticulously crafted
                product. Designed for durability and performance, it meets all
                your daily needs while adding a touch of elegance to your
                lifestyle.
              </p>
            </div>
          </div>

          <div className="flat-title-tab-product-des">
            <div className="flat-title-tab">
              <ul className="menu-tab-line">
                <li className="nav-tab-item">
                  <p className="product-title fw-semibold">
                    Product information
                  </p>
                </li>
              </ul>
            </div>
            <div className="tab-main tab-info">
              <ul className="list-feature">
                <li>
                  <p className="name-feature">Quality</p>
                  <p className="property">Premium</p>
                </li>
                <li>
                  <p className="name-feature">Warranty</p>
                  <p className="property">1 Year Manufacturer</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Reviews Section - Now Dynamic */}
          <div className="flat-title-tab-product-des">
            <div className="flat-title-tab">
              <ul className="menu-tab-line">
                <li className="nav-tab-item">
                  <p className="product-title fw-semibold">Reviews</p>
                </li>
              </ul>
            </div>
            <div className="tab-main tab-review">
              <ReviewsList productId={productId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
