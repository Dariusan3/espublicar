"use client";
import React, { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";

export default function NavCategories({ styleClass = "" }) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={navRef} className={`nav-category-wrap ${styleClass}`}>
      <div
        onClick={() => setActiveDropdown((pre) => !pre)}
        className={`nav-title btn-active ${activeDropdown ? "active" : ""} `}
      >
        <i className="icon-menu-dots fs-20" />
        <h6 className="title fw-semibold">Todas las Categorías</h6>
      </div>
      <nav
        className={`category-menu active-item  ${
          activeDropdown ? "active" : ""
        }`}
      >
        <div className="menu-category-menu-container">
          <ul id="primary-menu" className="megamenu">
            {categories.map((category, index) => (
              <li className="menu-item" key={index}>
                <a href={category.href}>
                  <i className={`${category.iconClass} fs-20`} />
                  <span>{category.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
