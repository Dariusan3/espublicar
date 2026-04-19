"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useProducts from "@/hooks/useProducts";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({
  className = "",
  placeholder = "Search products...",
}: SearchBarProps) {
  const router = useRouter();
  const { searchProducts, products, isLoading } = useProducts();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchProducts({ search: value, limit: 6 });
        setShowDropdown(true);
      }, 300);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductClick = (productId: string) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/product/${productId}`);
  };

  return (
    <div ref={searchRef} className={`search-bar-wrapper ${className}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search products"
        />
        <button type="submit" className="search-btn" aria-label="Search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="search-dropdown">
          {isLoading ? (
            <div className="search-loading">
              <span className="spinner-sm" /> Searching...
            </div>
          ) : products.length > 0 ? (
            <>
              <ul className="search-results">
                {products.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => handleProductClick(String(product.id))}
                    className="search-result-item"
                  >
                    <Image
                      src={
                        product.imgSrc ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=100&auto=format&fit=crop"
                      }
                      alt={product.title}
                      width={50}
                      height={50}
                      className="search-result-img"
                    />
                    <div className="search-result-info">
                      <span className="search-result-title">
                        {product.title}
                      </span>
                      <span className="search-result-price">
                        €{product.price?.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleSubmit}
                className="search-view-all"
              >
                View all results for "{query}"
              </button>
            </>
          ) : (
            <div className="search-no-results">No products found</div>
          )}
        </div>
      )}

      <style jsx>{`
        .search-bar-wrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
        }
        .search-form {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
        }
        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
        }
        .search-btn {
          padding: 12px 16px;
          background: var(--primary-color, #000);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .search-btn:hover {
          opacity: 0.8;
        }
        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          margin-top: 8px;
          z-index: 1000;
          max-height: 400px;
          overflow-y: auto;
        }
        .search-loading,
        .search-no-results {
          padding: 20px;
          text-align: center;
          color: #666;
        }
        .search-results {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-result-item:hover {
          background: #f5f5f5;
        }
        .search-result-img {
          border-radius: 4px;
          object-fit: cover;
        }
        .search-result-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .search-result-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        .search-result-price {
          font-size: 13px;
          color: var(--primary-color, #000);
          font-weight: 600;
        }
        .search-view-all {
          width: 100%;
          padding: 14px;
          border: none;
          background: #f5f5f5;
          color: var(--primary-color, #000);
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-view-all:hover {
          background: #eee;
        }
        .spinner-sm {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ddd;
          border-top-color: var(--primary-color, #000);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
