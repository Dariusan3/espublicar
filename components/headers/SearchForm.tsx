"use client";
import React, { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";

export default function SearchForm({
  parentClass = "form-search-product style-2",
}) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todas las categorías");
  const navRef = useRef<HTMLFormElement>(null);
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

  return (
    <form
      ref={navRef}
      onSubmit={(e) => e.preventDefault()}
      className={parentClass}
    >
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
        <input type="text" placeholder="Buscar productos" />
      </fieldset>
      <button type="submit" className="btn-submit-form">
        <i className="icon-search"></i>
      </button>
    </form>
  );
}
