"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/helpers/common";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";

export default function Quickview() {
  const [quickviewImages, setQuickviewImages] = useState<string[]>([]);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);
  const { quickViewItem, addProductToCart, isAddedToCartProducts } =
    useContextElement();
  useEffect(() => {
    if (!quickViewItem) return;
    const images = (quickViewItem.thumbImages?.length
      ? quickViewItem.thumbImages
      : [quickViewItem.imgSrc, quickViewItem.imgHover]
    ).filter(Boolean);
    setQuickviewImages(images);
  }, [quickViewItem]);

  // The shell always stays mounted: Bootstrap's data-api resolves #quickView on
  // click, and a missing target throws "Cannot read properties of undefined
  // (reading 'backdrop')". Only the contents wait for a product.
  return (
    <div
      className="modal fade modalCentered modal-def modal-quick-view"
      id="quickView"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content flex-md-row">
          <span
            className="icon-close icon-close-popup link"
            data-bs-dismiss="modal"
          />
          {!quickViewItem ? null : (
            <>
          <div className="quickview-image">
            <div className="product-thumb-slider">
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation={{
                  prevEl: ".snbpqv",
                  nextEl: ".snbnqv",
                }}
                className="swiper tf-product-view-main"
                thumbs={{ swiper: thumbSwiper }}
              >
                {quickviewImages.map((elm, i) => (
                  <SwiperSlide key={i} className="swiper-slide">
                    <Link
                      href={`/product/${quickViewItem.id}`}
                      className="d-block tf-image-view"
                    >
                      <Image
                        src={elm}
                        alt=""
                        className="lazyload"
                        width={900}
                        height={1000}
                      />
                    </Link>
                  </SwiperSlide>
                ))}

                <div className="swiper-button-prev nav-swiper-2 single-slide-prev snbpqv" />
                <div className="swiper-button-next nav-swiper-2 single-slide-next snbnqv" />
              </Swiper>
              <Swiper
                className="swiper tf-product-view-thumbs"
                data-direction="horizontal"
                onSwiper={setThumbSwiper}
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
                  },
                }}
                modules={[FreeMode, Thumbs]}
              >
                {quickviewImages.map((elm, i) => (
                  <SwiperSlide key={i} className="swiper-slide">
                    <div className="item">
                      <Image alt="" src={elm} width={900} height={1000} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="quickview-info-wrap">
            <div className="quickview-info-inner">
              <div className="tf-product-info-content">
                <div className="infor-heading">
                  {quickViewItem.category && (
                    <p className="caption">
                      <Link
                        href={`/shop-default?category=${encodeURIComponent(
                          quickViewItem.category,
                        )}`}
                        className="link text-secondary"
                      >
                        {quickViewItem.category}
                      </Link>
                    </p>
                  )}
                  <h5 className="product-info-name fw-semibold">
                    <Link href={`/product/${quickViewItem.id}`} className="link">
                      {quickViewItem.title}
                    </Link>
                  </h5>
                  <ul className="product-info-rate-wrap">
                    {quickViewItem.rating ? (
                      <li className="star-review">
                        <ul className="list-star">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <li key={star}>
                              <i
                                className={`icon-star ${
                                  star <= Math.round(quickViewItem.rating)
                                    ? ""
                                    : "text-main-4"
                                }`}
                              />
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : null}
                    {quickViewItem.location && (
                      <li>
                        <p className="caption text-main-2">
                          {quickViewItem.location}
                        </p>
                      </li>
                    )}
                    {quickViewItem.userId && (
                      <li className="d-flex">
                        <Link
                          href={`/seller/${quickViewItem.userId}`}
                          className="caption text-secondary link"
                        >
                          Ver vendedor
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="infor-center">
                  <div className="product-info-price">
                    <h4 className="text-primary">
                      {formatPrice(quickViewItem.price)}
                    </h4>
                    {quickViewItem.oldprice && (
                      <span className="price-text text-main-2 old-price">
                        {formatPrice(quickViewItem.oldprice)}
                      </span>
                    )}
                  </div>
                  <ul className="product-fearture-list">
                    {quickViewItem.condition && (
                      <li>
                        <p className="body-md-2 fw-semibold">Estado</p>
                        <span className="body-text-3">
                          {quickViewItem.condition}
                        </span>
                      </li>
                    )}
                    {quickViewItem.location && (
                      <li>
                        <p className="body-md-2 fw-semibold">Ubicación</p>
                        <span className="body-text-3">
                          {quickViewItem.location}
                        </span>
                      </li>
                    )}
                    {quickViewItem.isNegotiable && (
                      <li>
                        <p className="body-md-2 fw-semibold">Precio</p>
                        <span className="body-text-3">Negociable</span>
                      </li>
                    )}
                  </ul>
                </div>
                {quickViewItem.description && (
                  <div className="infor-bottom">
                    <h6 className="fw-semibold">Descripción</h6>
                    <p className="body-text-3">
                      {String(quickViewItem.description).slice(0, 320)}
                      {String(quickViewItem.description).length > 320 ? "…" : ""}
                    </p>
                  </div>
                )}
              </div>
              <div className="box-quantity-wrap">
                <Link
                  href={`/product/${quickViewItem.id}`}
                  className="tf-btn"
                  data-bs-dismiss="modal"
                >
                  <span className="text-white">Ver anuncio</span>
                </Link>
                <a
                  href="#shoppingCart"
                  className="tf-btn btn-gray"
                  data-bs-toggle="offcanvas"
                  onClick={() => addProductToCart(quickViewItem.id, 1)}
                >
                  <span className="text-white">
                    {isAddedToCartProducts(quickViewItem.id)
                      ? "Ya está en el carrito"
                      : "Añadir al carrito"}
                  </span>
                </a>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
