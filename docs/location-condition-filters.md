# Location & Condition Filters

Filter products by city/location and item condition in the shop sidebar.

## How It Works

1. `useProducts` hook extended with `location` and `condition` fields in `ProductFilters`
2. `searchProducts` adds `Query.search("location", ...)` and `Query.equal("condition", ...)` when filters are set
3. `getLocations()` method extracts unique locations from all products (same pattern as `getCategories`)
4. `FilterSidebar` renders Location and Condition as collapsible radio-button sections

## Files Modified

- `hooks/useProducts.ts` — Added `location`, `condition`, `userId` to `ProductFilters`; added query clauses for each; added `getLocations()` method
- `components/shop/FilterSidebar.tsx` — Added "Ubicación" (location) and "Estado" (condition) filter sections; translated all labels to Spanish

## Filter Options

### Condition values
- Nuevo (Reluciente)
- Como nuevo
- Muy bueno
- Bueno (Usado)
- Aceptable (Con marcas)

### Location
Dynamic list populated from existing product locations. Radio buttons with "Todas las ubicaciones" default.

## URL Parameters

Shop pages can accept `?location=` and `?condition=` query params for deep-linking from category or navigation pages.
