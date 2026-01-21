import React from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
export default function Hero() {
  return (
    <section className="tf-sp-5">
      <div className="container">
        <div className="s-banner-wrapper">
          <div className="wrap-item-1 d-none d-lg-block">
            <div className="tf-nav-menu">
              <div className="main-nav">
                <h6 className="fw-semibold title">
                  <i className="icon-menu-dots" />
                  Todas las Categorías
                </h6>
                <ul className="menu-category-list">
                  {categories.map((category, index) => (
                    <li className="menu-item" key={index}>
                      <a href={category.href} className="item-link body-text-3">
                        <span>
                          <i className={`icon ${category.iconClass}`} />
                          {category.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="wrap-item-2 w-100 ps-xl-4">
            <div
              className="banner-search-hero d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
                padding: "60px 40px",
                minHeight: "400px",
                backgroundImage: "url(/images/banner/banner-30.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              {/* Overlay for better text readability */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderRadius: "12px",
                }}
              ></div>

              <div
                className="text-center w-100"
                style={{ position: "relative", zIndex: 2 }}
              >
                <h1 className="text-white mb-4 fw-bold">
                  What are you looking for?
                </h1>
                <div className="mx-auto" style={{ maxWidth: "700px" }}>
                  <form
                    action="/shop-default"
                    className="form-search-hero d-flex gap-2 p-2 bg-white rounded-3 shadow-sm"
                  >
                    <div className="flex-grow-1 position-relative">
                      <i
                        className="icon-search text-secondary"
                        style={{
                          position: "absolute",
                          left: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "20px",
                        }}
                      ></i>
                      <input
                        type="text"
                        placeholder="Search for cars, electronics, jobs..."
                        className="w-100 border-0"
                        name="query"
                        style={{
                          height: "50px",
                          paddingLeft: "45px",
                          outline: "none",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="tf-btn btn-primary rounded-2 px-5"
                    >
                      Search
                    </button>
                  </form>
                  <div className="mt-4 d-flex gap-2 justify-content-center flex-wrap">
                    <span className="text-white opacity-75">Popular:</span>
                    <a
                      href="/shop-default"
                      className="text-white text-decoration-underline"
                    >
                      iPhone
                    </a>
                    <a
                      href="/shop-default"
                      className="text-white text-decoration-underline"
                    >
                      Cars
                    </a>
                    <a
                      href="/shop-default"
                      className="text-white text-decoration-underline"
                    >
                      Laptops
                    </a>
                    <a
                      href="/shop-default"
                      className="text-white text-decoration-underline"
                    >
                      Furniture
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
