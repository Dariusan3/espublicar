"use client";

import Image from "next/image";
import Link from "next/link";
import { FreeMode, Thumbs } from "swiper/modules";
import { type Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import AddToWishlist from "../common/AddToWishlist";
import AddToQuickview from "../common/AddToQuickview";
import { useState } from "react";
import CountdownTimer from "../common/Countdown";
import { formatPrice } from "@/helpers/common";

interface Product {
  id: string | number;
  images: string[];
  title: string;
  discount?: number;
  price: number;
  oldprice?: number;
  countdown?: number;
  condition?: string;
  location?: string;
  isNegotiable?: boolean;
}

const ProductCard2 = ({
  product,
  parentClass = "card-product style-border style-thums-2 p-lg-30 wow fadeInUp",
  typeClass = "",
}: {
  product: any;
  parentClass?: string;
  typeClass?: string;
}) => {
  const [thumbSlider, setThumbSlider] = useState<SwiperType | null>(null);
  return (
    <div className={parentClass} data-wow-delay={0}>
      <div className="card-product-wrapper overflow-visible aspect-ratio-0">
        <div className={`product-thumb-slider thumbs-right ${typeClass} `}>
          <Swiper
            thumbs={{ swiper: thumbSlider }}
            className="swiper tf-product-view-main "
            modules={[Thumbs]}
          >
            {product.images?.map((image: string, index: number) => (
              <SwiperSlide className="swiper-slide" key={`main-${index}`}>
                <Link
                  href={`/product/${product.id}`}
                  className="d-block tf-image-view"
                >
                  <Image
                    src={image}
                    alt={product.title}
                    className="lazyload"
                    width={857}
                    height={482}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            className="swiper tf-product-view-thumbs"
            onSwiper={setThumbSlider}
            {...{
              direction: "horizontal",
              spaceBetween: 10,
              slidesPerView: "auto",
              freeMode: true,
              watchSlidesProgress: true,
              observer: true,
              observeParents: true,
              nested: true,
              breakpoints: {
                0: {
                  direction: "horizontal",
                },
                576: {
                  direction: "vertical",
                },
              },
            }}
            modules={[FreeMode, Thumbs]}
          >
            {product.images?.map((image: string, index: number) => (
              <SwiperSlide className="swiper-slide" key={`thumb-${index}`}>
                <div className="item">
                  <Image
                    alt={product.title}
                    src={image}
                    width={857}
                    height={482}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {product.discount && (
          <div className="box-sale-wrap style-2 z-5">
            <p className="small-text">Save</p>
            <p className="title-sidebar-2">{formatPrice(product.discount)}</p>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <div className="box-title gap-xl-6">
          <div className="d-flex flex-column">
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
            <h6 className="bg-white relative z-5">
              <Link
                href={`/product/${product.id}`}
                className="name-product fw-semibold text-secondary link"
              >
                {product.title}
              </Link>
            </h6>
            {product.location && (
              <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                <i className="icon-map-pin" style={{ fontSize: "0.8rem" }}></i>
                <span>{product.location}</span>
              </div>
            )}
          </div>
          <div className="group-btn">
            <p className="price-wrap fw-medium">
              <span className="new-price h4 fw-normal text-primary mb-0">
                {formatPrice(product.price)}
              </span>
              {product.oldprice && (
                <span className="old-price price-text text-main-2">
                  {formatPrice(product.oldprice)}
                </span>
              )}
            </p>
            <ul className="list-product-btn flex-row">
              <li>{/* <AddToCart productId={product.id} /> */}</li>
              <li className="wishlist">
                <AddToWishlist productId={product.id} />
              </li>
              <li>
                <AddToQuickview productId={product.id} product={product} />
              </li>
              <li>
                
              </li>
            </ul>
          </div>
        </div>
        {product.countdown && (
          <div className="box-infor-detail gap-xl-20">
            <div className="countdown-box">
              <div
                className="js-countdown"
                data-timer={product.countdown}
                data-labels="Days,Hours,Mins,Secs"
              >
                <CountdownTimer style={2} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductCard2;
