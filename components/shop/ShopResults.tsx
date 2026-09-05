"use client";
import React, { useEffect, useMemo, useState } from "react";
import FilterSidebar from "@/components/shop/FilterSidebar";
import useProducts, { ProductFilters } from "@/hooks/useProducts";
import ShopProductCard from "../productCards/ShopProductCard";
import { useSearchParams } from "next/navigation";
import { SkeletonGrid, EmptyState } from "@/components/common/Skeleton";

const SORT_OPTIONS: { value: NonNullable<ProductFilters["sortBy"]>; label: string }[] =
  [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "price_asc", label: "Precio: de menor a mayor" },
    { value: "price_desc", label: "Precio: de mayor a menor" },
    { value: "rating", label: "Mejor valorados" },
  ];

const FEATURE_LABELS: Partial<Record<keyof ProductFilters, string>> = {
  isNew: "Sin estrenar",
  isTodaysDeals: "Ofertas del día",
  hotSale: "Rebajados",
  inStock: "Disponible",
};

export default function ShopResults() {
  const { searchProducts, products, totalCount, isLoading } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemsPerPage = 12;

  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      const currentFilters: ProductFilters = { ...filters };
      if (query) currentFilters.search = query;
      if (category) currentFilters.category = category;
      await searchProducts({ ...currentFilters, limit: itemsPerPage, offset });
    };
    fetchProducts();
  }, [filters, currentPage, searchProducts, query, category]);

  // Lock the page behind the mobile filter drawer.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const removeFilter = (key: keyof ProductFilters) => {
    const next = { ...filters };
    delete next[key];
    if (key === "minPrice" || key === "maxPrice") {
      delete next.minPrice;
      delete next.maxPrice;
    }
    handleFilterChange(next);
  };

  const clearAll = () => {
    const next: ProductFilters = {};
    if (filters.sortBy) next.sortBy = filters.sortBy;
    handleFilterChange(next);
  };

  /** Applied filters, as removable chips. Sorting is not a filter. */
  const activeChips = useMemo(() => {
    const chips: { key: keyof ProductFilters; label: string }[] = [];
    if (filters.category) chips.push({ key: "category", label: filters.category });
    if (filters.condition)
      chips.push({ key: "condition", label: filters.condition });
    if (filters.location) chips.push({ key: "location", label: filters.location });
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      chips.push({
        key: "minPrice",
        label:
          filters.maxPrice === undefined
            ? `Desde ${filters.minPrice} €`
            : filters.minPrice === undefined || filters.minPrice === 0
              ? `Hasta ${filters.maxPrice} €`
              : `${filters.minPrice} – ${filters.maxPrice} €`,
      });
    }
    (Object.keys(FEATURE_LABELS) as (keyof ProductFilters)[]).forEach((key) => {
      if (filters[key] === true)
        chips.push({ key, label: FEATURE_LABELS[key] as string });
    });
    return chips;
  }, [filters]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document
        .getElementById("gridLayout")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const firstShown = products.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastShown = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flat-content">
      <div className="container">
        <div className="shop-v2">
          {/* Desktop sidebar */}
          <div className="shop-v2-aside d-none d-xl-block">
            <FilterSidebar
              currentFilters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>

          <div className="shop-v2-main">
            <div className="shop-v2-toolbar">
              <button
                type="button"
                className="shop-v2-filter-btn d-inline-flex d-xl-none"
                onClick={() => setDrawerOpen(true)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="14" y2="12" />
                  <line x1="4" y1="17" x2="9" y2="17" />
                </svg>
                Filtros
                {activeChips.length > 0 && (
                  <span className="shop-v2-filter-count">
                    {activeChips.length}
                  </span>
                )}
              </button>

              <p className="shop-v2-count">
                {isLoading ? (
                  "Buscando anuncios…"
                ) : totalCount === 0 ? (
                  "Sin resultados"
                ) : (
                  <>
                    <strong>
                      {firstShown}–{lastShown}
                    </strong>{" "}
                    de {totalCount} {totalCount === 1 ? "anuncio" : "anuncios"}
                  </>
                )}
              </p>

              <div className="shop-v2-sort">
                <label htmlFor="shop-sort">Ordenar</label>
                <div className="shop-v2-select">
                  <select
                    id="shop-sort"
                    value={filters.sortBy || "newest"}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filters,
                        sortBy: e.target.value as ProductFilters["sortBy"],
                      })
                    }
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="shop-v2-chips">
                {activeChips.map((chip) => (
                  <button
                    key={String(chip.key)}
                    type="button"
                    className="shop-v2-chip"
                    onClick={() => removeFilter(chip.key)}
                  >
                    {chip.label}
                    <span aria-hidden="true">×</span>
                    <span className="visually-hidden">Quitar filtro</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="shop-v2-chip-clear"
                  onClick={clearAll}
                >
                  Limpiar todo
                </button>
              </div>
            )}

            <div className="gridLayout-wrapper">
              {isLoading ? (
                <SkeletonGrid count={6} />
              ) : products.length === 0 ? (
                <EmptyState
                  illustration="search"
                  title="No encontramos anuncios con estos filtros"
                  description="Prueba a quitar algún filtro o a ampliar el rango de precio."
                />
              ) : (
                <>
                  <div
                    className="tf-grid-layout lg-col-3 md-col-2 sm-col-2 flat-grid-product wrapper-shop layout-tabgrid-1"
                    id="gridLayout"
                  >
                    {products.map((product, i) => (
                      <ShopProductCard
                        key={product.id || i}
                        product={product as any}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <ul className="wg-pagination wd-load">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`link ${currentPage === 1 ? "disabled" : ""}`}
                          aria-label="Página anterior"
                        >
                          <i className="icon-arrow-left-lg" />
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
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
                        ),
                      )}
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`link ${currentPage === totalPages ? "disabled" : ""}`}
                          aria-label="Página siguiente"
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

      {/* Mobile filter drawer */}
      <div
        className={`shop-v2-scrim ${drawerOpen ? "is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`shop-v2-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
      >
        <div className="shop-v2-drawer-head">
          <h2>Filtros</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar filtros"
          >
            ×
          </button>
        </div>
        <div className="shop-v2-drawer-body">
          <FilterSidebar
            currentFilters={filters}
            onFiltersChange={handleFilterChange}
            onApply={() => setDrawerOpen(false)}
            resultCount={totalCount}
          />
        </div>
      </div>
    </div>
  );
}
