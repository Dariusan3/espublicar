"use client";
import React, { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { useRouter } from "next/navigation";

export default function SearchForm({
  parentClass = "form-search-product style-2",
}) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todas las categorías");
  const [activeCategoryValue, setActiveCategoryValue] = useState("");
  const navRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputRef.current?.value || "";
    // Construct query parameters
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (activeCategoryValue) params.set("category", activeCategoryValue);

    router.push(`/shop-default?${params.toString()}`);
  };

  return (
    <form ref={navRef} onSubmit={handleSubmit} className={parentClass}>
      <div className={`select-category ${activeDropdown ? "active" : ""}`}>
        <div
          onClick={() => setActiveDropdown(true)}
          className="tf-select-custom"
        >
          {activeCategory}
        </div>
        <ul
          className="select-options"
          style={{ display: activeDropdown ? "block" : "none" }}
        >
          <div className="header-select-option">
            <span>Seleccionar Categoría</span>
            <span
              className="close-option"
              onClick={() => setActiveDropdown(false)}
            >
              <i className="icon-close"></i>
            </span>
          </div>
          <li
            rel=""
            onClick={() => {
              setActiveCategory("Todas las categorías");
              setActiveCategoryValue("");
              setActiveDropdown(false);
            }}
          >
            Todas las categorías
          </li>
          {categories.map((item, index) => (
            <li
              rel={item.value}
              onClick={() => {
                setActiveCategory(item.label);
                setActiveCategoryValue(item.value);
                setActiveDropdown(false);
              }}
              key={index}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <span className="br-line type-vertical bg-line"></span>
      <fieldset>
        <input ref={inputRef} type="text" placeholder="Buscar productos" />
      </fieldset>
      <button type="submit" className="btn-submit-form">
        <i className="icon-search"></i>
      </button>
    </form>
  );
}
