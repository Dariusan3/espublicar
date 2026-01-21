"use client";
import { useState, useEffect } from "react";
import useProducts, { ProductFilters } from "@/hooks/useProducts";

interface FilterSidebarProps {
  onFiltersChange: (filters: ProductFilters) => void;
  currentFilters: ProductFilters;
  className?: string;
}

export default function FilterSidebar({
  onFiltersChange,
  currentFilters,
  className = "",
}: FilterSidebarProps) {
  const { getCategories, getBrands } = useProducts();
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [localFilters, setLocalFilters] =
    useState<ProductFilters>(currentFilters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brands: false,
    features: false,
  });

  // Load categories and brands on mount
  useEffect(() => {
    const loadFilters = async () => {
      const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
      setCategories(cats);
      setBrands(brs);
    };
    loadFilters();
  }, [getCategories, getBrands]);

  // Sync local filters with prop changes
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const cleared: ProductFilters = {};
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => localFilters[key as keyof ProductFilters] !== undefined,
  );

  return (
    <aside className={`filter-sidebar ${className}`}>
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-btn">
            Clear All
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("category")}
        >
          <span>Category</span>
          <span
            className={`arrow ${expandedSections.category ? "up" : "down"}`}
          >
            ▾
          </span>
        </button>
        {expandedSections.category && (
          <div className="section-content">
            <label className="filter-option">
              <input
                type="radio"
                name="category"
                checked={!localFilters.category}
                onChange={() => updateFilter("category", undefined)}
              />
              <span>All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={localFilters.category === cat}
                  onChange={() => updateFilter("category", cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("price")}
        >
          <span>Price Range</span>
          <span className={`arrow ${expandedSections.price ? "up" : "down"}`}>
            ▾
          </span>
        </button>
        {expandedSections.price && (
          <div className="section-content price-range">
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                min={0}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                min={0}
                className="price-input"
              />
            </div>
            <div className="price-presets">
              {[
                { label: "Under $25", min: 0, max: 25 },
                { label: "$25 - $50", min: 25, max: 50 },
                { label: "$50 - $100", min: 50, max: 100 },
                { label: "Over $100", min: 100, max: undefined },
              ].map((preset) => (
                <button
                  key={preset.label}
                  className={`price-preset ${
                    localFilters.minPrice === preset.min &&
                    localFilters.maxPrice === preset.max
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    updateFilter("minPrice", preset.min);
                    updateFilter("maxPrice", preset.max);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection("features")}
        >
          <span>Features</span>
          <span
            className={`arrow ${expandedSections.features ? "up" : "down"}`}
          >
            ▾
          </span>
        </button>
        {expandedSections.features && (
          <div className="section-content">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={localFilters.inStock === true}
                onChange={(e) =>
                  updateFilter("inStock", e.target.checked ? true : undefined)
                }
              />
              <span>In Stock Only</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={localFilters.isNew === true}
                onChange={(e) =>
                  updateFilter("isNew", e.target.checked ? true : undefined)
                }
              />
              <span>New Arrivals</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={localFilters.isTodaysDeals === true}
                onChange={(e) =>
                  updateFilter(
                    "isTodaysDeals",
                    e.target.checked ? true : undefined,
                  )
                }
              />
              <span>Today's Deals</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={localFilters.hotSale === true}
                onChange={(e) =>
                  updateFilter("hotSale", e.target.checked ? true : undefined)
                }
              />
              <span>Hot Sale</span>
            </label>
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="filter-section">
        <label className="sort-label">Sort By</label>
        <select
          value={localFilters.sortBy || "newest"}
          onChange={(e) =>
            updateFilter("sortBy", e.target.value as ProductFilters["sortBy"])
          }
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <style jsx>{`
        .filter-sidebar {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .filter-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        .clear-btn {
          background: none;
          border: none;
          color: var(--primary-color, #c00);
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
        }
        .filter-section {
          margin-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 16px;
        }
        .filter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .section-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          color: #333;
        }
        .arrow {
          transition: transform 0.2s;
        }
        .arrow.up {
          transform: rotate(180deg);
        }
        .section-content {
          padding-top: 12px;
        }
        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          cursor: pointer;
          font-size: 14px;
          color: #555;
        }
        .filter-option:hover {
          color: #000;
        }
        .filter-option input {
          accent-color: var(--primary-color, #000);
        }
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .price-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          min-width: 0;
          width: 100%;
        }
        .price-separator {
          color: #999;
        }
        .price-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .price-preset {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          background: #fff;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .price-preset:hover,
        .price-preset.active {
          background: var(--primary-color, #000);
          color: #fff;
          border-color: var(--primary-color, #000);
        }
        .sort-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .sort-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
          cursor: pointer;
        }
      `}</style>
    </aside>
  );
}
