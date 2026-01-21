"use client";
import React, { useEffect, useState } from "react";
import FilterSidebar from "@/components/shop/FilterSidebar"; // Use new component
import useProducts, { ProductFilters } from "@/hooks/useProducts";
import ProductCards3 from "../productCards/ProductCards3";
import { Product } from "@/types/Types";
import { useSearchParams } from "next/navigation";

export default function Products1() {
  const { searchProducts, products, totalCount, isLoading } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  // Fetch products when filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      const currentFilters: ProductFilters = { ...filters };

      // Apply URL params if they exist and override local state if needed
      // Or better, syncing state with URL is complex.
      // For now, let's just make sure when URL changes, we search.

      if (query) currentFilters.search = query;
      if (category) currentFilters.category = category;

      await searchProducts({ ...currentFilters, limit: itemsPerPage, offset });
    };
    fetchProducts();
  }, [filters, currentPage, searchProducts, query, category]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of grid
      document
        .getElementById("gridLayout")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flat-content">
      <div className="container">
        <div className="tf-product-view-content wrapper-control-shop">
          {/* Mobile Filter Sidebar Wrapper (reusing existing classes for layout) */}
          <div className="canvas-filter-product sidebar-filter handle-canvas left d-xl-none">
            <div className="canvas-wrapper">
              <div className="canvas-header d-flex d-xl-none">
                <h5 className="title">Filter</h5>
                <span className="icon-close link icon-close-popup close-filter" />
              </div>
              <div className="canvas-body">
                {/* New Filter Sidebar */}
                <FilterSidebar
                  currentFilters={filters}
                  onFiltersChange={handleFilterChange}
                  className="w-100"
                />
              </div>
            </div>
          </div>

          <div className="content-area w-100">
            <div className="tf-shop-control flex-wrap gap-10">
              <div className="d-flex align-items-center gap-10">
                <button
                  id="filterShop"
                  className="tf-btn-filter d-flex d-xl-none"
                  onClick={() =>
                    document
                      .querySelector(".sidebar-filter")
                      ?.classList.add("show")
                  }
                >
                  <span className="icon icon-filter">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="#121212"
                      viewBox="0 0 256 256"
                    >
                      <path d="M176,80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H184A8,8,0,0,1,176,80ZM40,88H144v16a8,8,0,0,0,16,0V56a8,8,0,0,0-16,0V72H40a8,8,0,0,0,0,16Zm176,80H120a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16ZM88,144a8,8,0,0,0-8,8v16H40a8,8,0,0,0,0,16H80v16a8,8,0,0,0,16,0V152A8,8,0,0,0,88,144Z" />
                    </svg>
                  </span>
                  <span className="body-md-2 fw-medium">Filter</span>
                </button>
                <p className="body-text-3 d-none d-lg-block">
                  Showing{" "}
                  {products.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}
                  - {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                  {totalCount} results
                </p>
              </div>
            </div>

            <div className="row">
              {/* Desktop Filter Sidebar */}
              <div className="col-xl-3 d-none d-xl-block">
                <FilterSidebar
                  currentFilters={filters}
                  onFiltersChange={handleFilterChange}
                />
              </div>

              {/* Product Grid */}
              <div className="col-xl-9">
                <div className="gridLayout-wrapper">
                  {isLoading ? (
                    <div className="text-center p-5">Loading products...</div>
                  ) : (
                    <>
                      <div
                        className="tf-grid-layout lg-col-3 md-col-2 sm-col-2 flat-grid-product wrapper-shop layout-tabgrid-1"
                        id="gridLayout"
                      >
                        {products.length > 0 ? (
                          products.map((product, i) => (
                            // Cast to any if there are loose type mismatches with old component
                            <ProductCards3
                              key={product.id || i}
                              product={product as any}
                            />
                          ))
                        ) : (
                          <div className="col-12 text-center p-5">
                            No products found.
                          </div>
                        )}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <ul className="wg-pagination wd-load">
                          <li>
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`link ${currentPage === 1 ? "disabled" : ""}`}
                            >
                              <i className="icon-arrow-left-lg" />
                            </button>
                          </li>

                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((page) => (
                            <li
                              key={page}
                              className={currentPage === page ? "active" : ""}
                            >
                              <button
                                onClick={() => handlePageChange(page)}
                                className="title-normal link"
                              >
                                {page}
                              </button>
                            </li>
                          ))}

                          <li>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`link ${currentPage === totalPages ? "disabled" : ""}`}
                            >
                              <i className="icon-arrow-right-lg" />
                            </button>
                          </li>
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay/Scripts needing cleanup */}
      <div
        className="overlay-filter"
        onClick={() =>
          document.querySelector(".sidebar-filter")?.classList.remove("show")
        }
      ></div>
    </div>
  );
}
