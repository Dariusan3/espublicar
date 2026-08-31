"use client";
import { useState, useEffect, useMemo } from "react";
import useProducts, { ProductFilters } from "@/hooks/useProducts";

const CONDITIONS = ["Nuevo", "Como nuevo", "Muy bueno", "Bueno", "Aceptable"];

const PRICE_PRESETS = [
  { label: "Hasta 25 €", min: 0, max: 25 },
  { label: "25 – 50 €", min: 25, max: 50 },
  { label: "50 – 100 €", min: 50, max: 100 },
  { label: "Más de 100 €", min: 100, max: undefined },
];

const FEATURES: { key: keyof ProductFilters; label: string; hint: string }[] = [
  { key: "isNew", label: "Sin estrenar", hint: "Artículos nuevos, con etiqueta" },
  { key: "isTodaysDeals", label: "Ofertas del día", hint: "Precio rebajado hoy" },
  { key: "hotSale", label: "Rebajados", hint: "Bajaron de precio" },
  { key: "inStock", label: "Disponible", hint: "Aún no está reservado" },
];

/** Keys that count as an applied filter (sorting and paging do not). */
const FILTER_KEYS: (keyof ProductFilters)[] = [
  "category",
  "location",
  "condition",
  "minPrice",
  "maxPrice",
  "isNew",
  "isTodaysDeals",
  "hotSale",
  "inStock",
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`fs-chevron ${open ? "is-open" : ""}`}
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
  );
}

function Check() {
  return (
    <svg
      className="fs-check"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface FilterSidebarProps {
  onFiltersChange: (filters: ProductFilters) => void;
  currentFilters: ProductFilters;
  className?: string;
  /** Rendered inside the mobile drawer as the closing action. */
  onApply?: () => void;
  resultCount?: number;
}

export default function FilterSidebar({
  onFiltersChange,
  currentFilters,
  className = "",
  onApply,
  resultCount,
}: FilterSidebarProps) {
  const { getCategories, getLocations } = useProducts();
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [localFilters, setLocalFilters] =
    useState<ProductFilters>(currentFilters);
  const [expanded, setExpanded] = useState({
    category: true,
    price: true,
    condition: true,
    location: false,
    features: false,
  });

  useEffect(() => {
    const loadFilters = async () => {
      const [cats, locs] = await Promise.all([getCategories(), getLocations()]);
      setCategories(cats);
      setLocations(locs);
    };
    loadFilters();
  }, [getCategories, getLocations]);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const toggleSection = (section: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));

  /** Patch several keys at once: setting min and max in two calls would drop
   *  the first one, since both would build on the same stale state. */
  const updateFilters = (patch: Partial<ProductFilters>) => {
    const next = { ...localFilters, ...patch };
    FILTER_KEYS.forEach((key) => {
      if (next[key] === undefined) delete next[key];
    });
    setLocalFilters(next);
    onFiltersChange(next);
  };

  const clearFilters = () => {
    const cleared: ProductFilters = {};
    if (localFilters.sortBy) cleared.sortBy = localFilters.sortBy;
    if (localFilters.search) cleared.search = localFilters.search;
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const activeCount = useMemo(() => {
    let count = FILTER_KEYS.filter(
      (key) => key !== "minPrice" && key !== "maxPrice",
    ).filter((key) => localFilters[key] !== undefined).length;
    if (
      localFilters.minPrice !== undefined ||
      localFilters.maxPrice !== undefined
    ) {
      count += 1;
    }
    return count;
  }, [localFilters]);

  const renderChoices = (
    name: "category" | "location" | "condition",
    allLabel: string,
    options: string[],
  ) => (
    <div className="fs-options" role="radiogroup" aria-label={allLabel}>
      <label className={`fs-option ${!localFilters[name] ? "is-active" : ""}`}>
        <input
          type="radio"
          name={name}
          checked={!localFilters[name]}
          onChange={() => updateFilters({ [name]: undefined })}
        />
        <span className="fs-option-label">{allLabel}</span>
        {!localFilters[name] && <Check />}
      </label>
      {options.map((option) => {
        const active = localFilters[name] === option;
        return (
          <label key={option} className={`fs-option ${active ? "is-active" : ""}`}>
            <input
              type="radio"
              name={name}
              checked={active}
              onChange={() => updateFilters({ [name]: option })}
            />
            <span className="fs-option-label">{option}</span>
            {active && <Check />}
          </label>
        );
      })}
    </div>
  );

  const section = (
    key: keyof typeof expanded,
    title: string,
    body: React.ReactNode,
    badge?: string,
  ) => (
    <div className="fs-section">
      <button
        type="button"
        className="fs-section-head"
        onClick={() => toggleSection(key)}
        aria-expanded={expanded[key]}
      >
        <span className="fs-section-title">{title}</span>
        {badge && <span className="fs-section-badge">{badge}</span>}
        <Chevron open={expanded[key]} />
      </button>
      {expanded[key] && <div className="fs-section-body">{body}</div>}
    </div>
  );

  const priceBadge =
    localFilters.minPrice !== undefined || localFilters.maxPrice !== undefined
      ? `${localFilters.minPrice ?? 0} – ${localFilters.maxPrice ?? "∞"} €`
      : undefined;

  return (
    <aside className={`fs ${className}`} aria-label="Filtros">
      <div className="fs-head">
        <h3 className="fs-title">
          Filtros
          {activeCount > 0 && <span className="fs-count">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button type="button" onClick={clearFilters} className="fs-clear">
            Limpiar
          </button>
        )}
      </div>

      {section(
        "category",
        "Categoría",
        renderChoices("category", "Todas las categorías", categories),
        localFilters.category,
      )}

      {section(
        "price",
        "Precio",
        <>
          <div className="fs-price-presets">
            {PRICE_PRESETS.map((preset) => {
              const active =
                localFilters.minPrice === preset.min &&
                localFilters.maxPrice === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  className={`fs-chip ${active ? "is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() =>
                    updateFilters(
                      active
                        ? { minPrice: undefined, maxPrice: undefined }
                        : { minPrice: preset.min, maxPrice: preset.max },
                    )
                  }
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="fs-price-inputs">
            <div className="fs-price-field">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Mín"
                aria-label="Precio mínimo"
                value={localFilters.minPrice ?? ""}
                onChange={(e) =>
                  updateFilters({
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <span className="fs-price-unit">€</span>
            </div>
            <span className="fs-price-dash" aria-hidden="true">
              –
            </span>
            <div className="fs-price-field">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Máx"
                aria-label="Precio máximo"
                value={localFilters.maxPrice ?? ""}
                onChange={(e) =>
                  updateFilters({
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <span className="fs-price-unit">€</span>
            </div>
          </div>
        </>,
        priceBadge,
      )}

      {section(
        "condition",
        "Estado",
        <div className="fs-chips" role="group" aria-label="Estado">
          {CONDITIONS.map((cond) => {
            const active = localFilters.condition === cond;
            return (
              <button
                key={cond}
                type="button"
                className={`fs-chip ${active ? "is-active" : ""}`}
                aria-pressed={active}
                onClick={() =>
                  updateFilters({ condition: active ? undefined : cond })
                }
              >
                {cond}
              </button>
            );
          })}
        </div>,
        localFilters.condition,
      )}

      {section(
        "location",
        "Ubicación",
        renderChoices("location", "Toda España", locations),
        localFilters.location,
      )}

      {section(
        "features",
        "Más filtros",
        <div className="fs-switches">
          {FEATURES.map((feature) => {
            const active = localFilters[feature.key] === true;
            return (
              <label key={String(feature.key)} className="fs-switch">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) =>
                    updateFilters({
                      [feature.key]: e.target.checked ? true : undefined,
                    } as Partial<ProductFilters>)
                  }
                />
                <span className="fs-switch-text">
                  <span className="fs-switch-label">{feature.label}</span>
                  <span className="fs-switch-hint">{feature.hint}</span>
                </span>
              </label>
            );
          })}
        </div>,
      )}

      {onApply && (
        <div className="fs-apply">
          <button type="button" className="fs-apply-btn" onClick={onApply}>
            Ver {resultCount ?? 0}{" "}
            {resultCount === 1 ? "anuncio" : "anuncios"}
          </button>
        </div>
      )}

    </aside>
  );
}
