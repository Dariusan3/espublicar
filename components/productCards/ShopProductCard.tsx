"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToCart from "../common/AddToCart";
import AddToWishlist from "../common/AddToWishlist";
import AddToQuickview from "../common/AddToQuickview";
import { Product } from "@/types/Types";
import { formatPrice } from "@/helpers/common";

export default function ShopProductCard({ product }: { product: Product }) {
  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <Link href={`/product/${product.id}`} className="product-img">
          <Image
            className="img-product ls-is-cached lazyloaded"
            src={product.imgSrc}
            alt={product.title}
            width={500}
            height={500}
          />
          <Image
            className="img-hover ls-is-cached lazyloaded"
            src={product.imgHover || product.imgSrc}
            alt={product.title}
            width={500}
            height={500}
          />
        </Link>
        <ul className="list-product-btn top-0 end-0">
          <li>
            <AddToCart productId={product.id} tooltipClass="tooltip-left" />
          </li>
          <li className="wishlist">
            <AddToWishlist productId={product.id} tooltipClass="tooltip-left" />
          </li>
          <li>
            <AddToQuickview
              productId={product.id}
              product={product}
              tooltipClass="tooltip-left"
            />
          </li>
        </ul>
        {product.hotSale && (
          <div className="box-sale-wrap pst-default">
            <p className="small-text">Sale</p>
            <p className="title-sidebar-2">70%</p>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <div className="box-title">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              {product.condition && (
                <span
                  className="badge bg-light text-primary border border-primary-subtle rounded-pill fw-medium"
                  style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                >
                  {product.condition}
                </span>
              )}
              {product.isNegotiable && (
                <span
                  className="badge bg-success-subtle text-success rounded-pill fw-medium"
                  style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                >
                  Negociable
                </span>
              )}
            </div>
            <Link
              href={`/product/${product.id}`}
              className="name-product body-md-2 fw-semibold text-secondary link"
            >
              {product.title}
            </Link>
            {product.location && (
              <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                <i className="icon-map-pin" style={{ fontSize: "0.8rem" }}></i>
                <span>{product.location}</span>
              </div>
            )}
          </div>
          <p className="price-wrap fw-medium">
            <span className="new-price price-text fw-medium">
              {formatPrice(product.price)}
            </span>
            {product.oldprice && (
              <span className="old-price body-md-2 text-main-2">
                {formatPrice(product.oldprice)}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
