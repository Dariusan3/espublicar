---
name: espublicar
description: Trust-first C2C second-hand marketplace — warm, local, secure.
colors:
  brand: "#2563EB"
  brand-600: "#1E4FD1"
  brand-700: "#1D46B8"
  brand-50: "#EFF5FF"
  brand-100: "#DBE8FF"
  ink: "#0F172A"
  ink-2: "#334155"
  ink-3: "#64748B"
  ink-4: "#94A3B8"
  surface: "#FFFFFF"
  surface-2: "#F8FAFC"
  surface-3: "#F1F5F9"
  line: "#E2E8F0"
  line-2: "#CBD5E1"
  success: "#16A34A"
  success-bg: "#DCFCE7"
  warn: "#F59E0B"
  danger: "#DC2626"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(40px, 4.2vw, 64px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(22px, 1.8vw, 28px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.04em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-600}"
    textColor: "{colors.surface}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  chip-hover:
    backgroundColor: "{colors.brand-50}"
    textColor: "{colors.ink}"
  card-product:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
---

# Design System: espublicar

## 1. Overview

**Creative North Star: "The Trusted Corner Shop"**

espublicar is a marketplace between strangers, so its whole job is to make a stranger feel safe. The system reads like a clean, well-lit local shop: familiar layout, honest photos, prices you can trust, and a shopkeeper who is clearly there if something goes wrong. Warmth comes from clarity and generous spacing, not decoration. Blue (#2563EB) is the badge of safety — it marks the actions and the trust signals (pago seguro, envío con seguimiento, ratings), and it earns its saturation by being scarce.

This is a **product** system: design serves the task. Every screen optimizes for the two jobs — list an item in about a minute, or find and buy one nearby without fear. Density is comfortable, never cramped; the interface leans on a 4px spacing rhythm and soft neutral surfaces so real product photos carry the color. It is mobile-first: cards are scannable, tap targets are large, primary actions sit in thumb reach.

It explicitly rejects four looks. Not a **generic SaaS template** — no gradient hero shouting, no endless identical icon-card grids, no eyebrow-over-every-section scaffolding. Not a **luxury boutique** — no thin high-fashion minimalism that makes a used sofa feel out of place. Not a **cold corporate or bank** UI — no grey enterprise stiffness. Not **cheap spammy classifieds** — no ad clutter, no low-contrast walls of text; the clean listing is the anti-OLX.

**Key Characteristics:**
- Trust rendered as UI (secure-pay, tracked-shipping, ratings), not slogans
- One scarce brand blue for action + safety; neutrals do the rest
- Comfortable, mobile-first density on a 4px rhythm
- Real product photography is the hero; chrome stays quiet
- Familiar marketplace patterns over novelty

## 2. Colors

A cool, neutral shop floor with a single confident blue for anything actionable or trust-bearing.

### Primary
- **Trust Blue** (#2563EB): Every primary action (Buscar, Publicar, Comprar), links, active nav, trust-signal icons, price accents. Hover deepens to **Trust Blue Deep** (#1E4FD1). This is the only saturated color on most screens.
- **Trust Blue Wash** (#EFF5FF) / **Trust Blue Tint** (#DBE8FF): Soft fills behind icons, category bubbles, hero glow, selected states.

### Neutral
- **Ink** (#0F172A): Primary text, headings.
- **Ink Muted** (#334155): Secondary text, captions, trust-strip labels — the readable muted, meets 4.5:1.
- **Ink Soft** (#64748B): Tertiary/meta only (timestamps, locations); never body copy on tinted surfaces.
- **Surface** (#FFFFFF) / **Surface Raised** (#F8FAFC) / **Surface Sunken** (#F1F5F9): Page, cards, section banding.
- **Line** (#E2E8F0) / **Line Strong** (#CBD5E1): Borders, dividers, input strokes.

### Semantic
- **Success Green** (#16A34A on #DCFCE7): "Negociable", accepted offers, verified, paid.
- **Warn Amber** (#F59E0B) / **Danger Red** (#DC2626): Pending / destructive.

### Named Rules
**The Scarce Blue Rule.** Trust Blue covers ≤10% of any screen. Its rarity is what makes it read as *safe action* rather than decoration. Never tint a whole section blue "for brand".
**The Muted Floor Rule.** Body text is Ink or Ink Muted — never Ink Soft (#64748B) on a tinted surface. Light-gray-for-elegance is forbidden; it is the #1 reason marketplaces feel untrustworthy.

## 3. Typography

**Display / Body / Label Font:** Inter (with system-ui, -apple-system, Segoe UI fallback)

**Character:** One family, many weights — no pairing. Inter's neutral, highly legible humanist sans is the plain-spoken shopkeeper voice: it disappears so photos and prices lead. Contrast comes from weight (400 vs 700) and size, never from a second typeface.

### Hierarchy
- **Display** (700, clamp 40–64px, 1.05, -0.02em): Hero headline only. `text-wrap: balance`.
- **Headline** (700, clamp 22–28px, 1.2, -0.02em): Section titles ("Categorías", "Cómo funciona").
- **Title** (600, 20px, 1.3): Card titles, dashboard subheads.
- **Body** (400, 16px, 1.55): Descriptions, copy. Cap prose at 65–75ch.
- **Label** (600, 12px, uppercase, +0.04em): The single hero eyebrow, chip and badge text. Sparingly.

### Named Rules
**The One Family Rule.** Inter only. Never introduce a second display face; hierarchy is weight + size + color.
**The Tabular Price Rule.** Prices use `font-variant-numeric: tabular-nums` so columns of € align. A misaligned price reads as sloppy, and sloppy reads as scam.

## 4. Elevation

Hybrid, tonal-first. Surfaces are flat at rest and separated by neutral banding (Surface / Surface Raised / Surface Sunken) and 1px lines. Shadows are soft, cool, and reserved for elements that float or respond to state — product cards on hover, the hero's floating cards, dropdowns, modals. No hard 2014-era drop shadows.

### Shadow Vocabulary
- **Rest lift** (`0 1px 2px rgba(15,23,42,.04), 0 1px 3px rgba(15,23,42,.06)`): Cards at rest, subtle.
- **Hover lift** (`0 4px 12px rgba(15,23,42,.06), 0 2px 4px rgba(15,23,42,.04)`): Card hover.
- **Float** (`0 12px 32px rgba(15,23,42,.08), 0 4px 12px rgba(15,23,42,.06)`): Hero floating cards, popovers.
- **Modal** (`0 24px 64px rgba(15,23,42,.12), 0 8px 24px rgba(15,23,42,.08)`): Dialogs, sheets.

### Named Rules
**The Flat-At-Rest Rule.** Depth is a response, not a default. A card earns a shadow by being hovered or by floating; a static grid stays flat and leans on lines + spacing.

## 5. Components

### Buttons
- **Shape:** Rounded (12px / `--radius-md`); pill (999px) for search + chips.
- **Primary (`btn-brand`):** Trust Blue (#2563EB) fill, white text, ~48px tall. Hover → Trust Blue Deep (#1E4FD1). The one loud element per view.
- **Hover / Focus:** Color deepen on hover; `:focus-visible` shows a 2px Trust Blue outline, 2px offset. Focus is never removed.
- **Secondary / Ghost:** Surface fill, Line border, Ink text; hover borders Trust Blue.

### Chips
- **Style:** Pill, Surface fill, 1px Line border, Ink Muted text. Used for search suggestions, condition/"Negociable" tags, filters.
- **State:** Hover → Trust Blue Wash fill + Trust Blue border. Selected filters → Trust Blue border + tint. `:focus-visible` outline.

### Cards / Containers
- **Corner Style:** 16px (`--radius-lg`) product cards; 12px inner media.
- **Background:** Surface (#FFFFFF) on Surface Raised (#F8FAFC) page.
- **Shadow Strategy:** Flat at rest → Hover lift on hover (see Elevation).
- **Border:** 1px Line.
- **Internal Padding:** 12px (`--space-3`). Never nest a card inside a card.

### Inputs / Fields
- **Style:** Surface fill, 1px Line stroke, pill or 12px radius. The hero search is a 48–64px pill with the CTA docked inside on the right.
- **Focus:** 2px Trust Blue outline, 2px offset (no removed outlines, no glow-only focus).
- **Placeholder:** Ink Soft is too light for placeholders — use Ink Muted so it clears 4.5:1.

### Navigation
- **Style:** Sticky top header, Surface bg, 1px bottom Line. Ink links, Trust Blue on active/hover. Mobile collapses to a bottom tab bar (thumb reach) + slide-in menu.

### Signature: Product Card (`card-product`)
Real photo (4:3) leads, condition chip top-left, then title (Title), location meta (Ink Soft + pin), and a tabular Trust Blue price. Wishlist/cart/quickview actions reveal top-right on hover. This card is the atom of the whole marketplace — keep it honest and photo-first.

## 6. Do's and Don'ts

### Do:
- **Do** keep Trust Blue (#2563EB) scarce — actions and trust signals only, ≤10% of a screen.
- **Do** render trust as UI: secure-payment, tracked-shipping, ratings, "Negociable" badges as concrete elements.
- **Do** use Ink (#0F172A) / Ink Muted (#334155) for all body text; verify ≥4.5:1.
- **Do** give every interactive element a visible `:focus-visible` outline and honor `prefers-reduced-motion`.
- **Do** lead with real product photography; let images carry the color.
- **Do** use tabular numerals for every price.
- **Do** design mobile-first — large tap targets, bottom-reachable primary actions, horizontally scrollable category strip.

### Don't:
- **Don't** ship the **generic SaaS template** — no gradient hero, no wall of identical icon cards, no tracked-uppercase eyebrow above every section (one hero eyebrow max).
- **Don't** use **gradient text** (`background-clip: text`) or **glassmorphism** as decoration.
- **Don't** drift toward a **luxury boutique** — no hairline high-fashion minimalism; used goods need warmth and legibility, not couture restraint.
- **Don't** go **cold corporate/bank** — no grey enterprise stiffness, no dense form-first screens.
- **Don't** become **cheap spammy classifieds** — no ad clutter, no low-contrast gray body text, no cramped listings. The clean card is the whole point.
- **Don't** add a second font family, side-stripe borders (`border-left` >1px accents), or numbered `01/02/03` markers on non-sequential sections.
