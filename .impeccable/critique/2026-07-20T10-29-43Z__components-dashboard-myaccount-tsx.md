---
target: my-account
total_score: 22
p0_count: 1
p1_count: 2
timestamp: 2026-07-20T10-29-43Z
slug: components-dashboard-myaccount-tsx
---
Method: dual-agent (A: af9128a51f3a8fce0 · B: a46e581cf50e328d7)

# Critique — my-account dashboard

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Loading = bare "…"; "Mensajes sin leer" hardcoded 0 = status actively false |
| 2 | Match System / Real World | 3 | Plain Spanish, but star icon = "Pedidos", $ = euro "Ventas" |
| 3 | User Control and Freedom | 2 | Stat tiles are non-interactive `<div>`; empty cards are dead-ends |
| 4 | Consistency and Standards | 3 | Two "Publicar" CTAs; hardcoded 0 can contradict sidebar live badge |
| 5 | Error Prevention | 2 | fetchData has no catch — rejected fetch renders 0s as fact |
| 6 | Recognition Rather Than Recall | 3 | Conventional, scannable; minor icon ambiguity |
| 7 | Flexibility and Efficiency | 2 | No drill-down/quick actions; tiles decorative for power users |
| 8 | Aesthetic and Minimalist Design | 2 | Minimal *template*: banned KPI row + twin empty cards = filler |
| 9 | Error Recovery | 1 | No error state anywhere; failed fetch = confident wrong dashboard |
| 10 | Help and Documentation | 2 | First-timer lands on two "you have nothing" cards, zero guidance |
| **Total** | | **22/40** | **Poor — significant rework before users are happy** |

## Anti-Patterns Verdict

**Does this look AI-generated? Yes.** Textbook admin-dashboard starter.

**LLM assessment:** Four tells, all present — (1) the banned **hero-metric grid** exactly: `.dashboard-v2-stats` = `repeat(4,1fr)` of identical `icon→28/700 number→14px label` tiles (DESIGN.md flags this as an absolute ban); (2) two structurally identical empty filler cards (`1fr 1fr`); (3) decorative icons on abstract metrics (star=Pedidos, $=euro Ventas); (4) generic greeting "Esto es lo que está pasando con tu cuenta" — machine-translated SaaS boilerplate vs PRODUCT.md's "warm, local, never slick". Matches PRODUCT.md anti-ref #1 (generic SaaS template) + leans #3 (cold corporate).

**Deterministic scan** (`detect.mjs`, exit 2): 3 advisory `design-system-font-size` — `_dashboard-v2.scss:217` 24px, `:263` 22px, `:376` 11px!important (all responsive down-steps; low severity). Grep evidence: **1 hardcoded fake metric** (`MyAccount.tsx:67 value:0`), **0 `:focus-visible`** in the whole stylesheet, **8× `var(--ink-3)`** + **1× `var(--ink-4)`** muted text on white/tinted surfaces (Muted Floor risk; line 313 empty-state = ink-4), **4× `!important`** on `.my-listing-status`. Clean on: side-stripe borders, gradient text, glassmorphism, arbitrary z-index (0 each).

**Detector ↔ review agreement:** both independently flagged the hardcoded 0, the missing focus states, and the ink-3/ink-4 muted text. Detector added the off-ramp font sizes the review didn't; review added the semantic problems (fake metric = trust breach, banned template) the detector can't judge.

**Visual overlay:** none — no browser automation (headless). No user-visible overlay available.

## Overall Impression

The shell is clean (tokens, 4px rhythm, a genuinely good sidebar with live active state + count badges), but the content pane is a generated-looking KPI poster that displays fabricated numbers with no failure path. Biggest opportunity: stop mirroring emptiness — turn this from a read-only metrics wall into an **inbox of things that need me**, and never show a number that isn't real.

## What's Working

1. **Token + spacing discipline** — everything on `--surface/--line/--radius-lg` + `--space-*` 4px grid; nothing off-grid.
2. **Tabular price honored** — `.stat-value` + sidebar badge use `tabular-nums`; `formatCurrency` uses `es-ES`.
3. **The sidebar is a real product** — live `is-active` via `usePathname`, count badges, scoped destructive logout hover, avatar identity. Better than the page it frames.

## Priority Issues

**[P0] Fabricated + unverified metrics.** "Mensajes sin leer" is hardcoded `0` (MyAccount.tsx:67); `fetchData` has no catch, so a failed fetch renders 0s as fact. Why: PRODUCT.md is trust-first — a confident wrong number (seller misses a waiting buyer) is a revenue leak and a broken-trust moment. Fix: wire the tile to real unread count (`useChat`/`useNotifications` exist) or remove it; on fetch error show "—" + retry, never a false 0. → **/impeccable harden**

**[P1] Stat grid is the banned hero-metric template.** Four identical icon+number+label tiles = DESIGN.md's named ban + loudest "AI/SaaS" tell, and low utility (a seller wants "what needs attention", not 4 KPIs). Fix: replace with an action-first summary — one honest line ("Tienes 2 anuncios activos y 1 mensaje sin responder") + 2-3 *clickable* status rows to listings/messages/orders; drop the star/$ icons. → **/impeccable distill**

**[P1] Empty states are dead-ends for the first-time seller.** `.dashboard-v2-empty-inline` = one flat sentence, no CTA (lines 133-135, 145-147). Why: the new user — the one the marketplace must convert — is told twice they have nothing with no path forward. Fix: make each actionable ("Publica tu primer artículo" → /add-product; browse to start a chat). → **/impeccable onboard**

**[P2] A11y: no focus, no reduced-motion, failing contrast.** 0 `:focus-visible` in the stylesheet; transitions unguarded by `prefers-reduced-motion`; empty-state text `--ink-4` #94A3B8 on white ≈ 2.6:1 (fails AA); subtitle/labels `--ink-3` #64748B on tinted `--surface-2` ≈ 4.4:1 (Muted Floor violation). Fix: shared 2px brand `:focus-visible`; reduced-motion guard; raise empty-state + subtitle to `--ink-2`. → **/impeccable audit**

**[P2] Mobile IA inverts thumb-reach.** ≤991px: sidebar goes `static`, so avatar + Publicar + 9 nav items stack *above* the content; header "Publicar" sits top-right (least reachable). DESIGN.md calls for a bottom tab bar. Fix: content-first source order on mobile, collapse nav to bottom tab/drawer, move Publicar to a thumb-reachable sticky/FAB. → **/impeccable adapt**

## Persona Red Flags

**Casey (mobile, one thumb):** scrolls past the whole stacked sidebar before seeing one stat; wanted-action "Publicar" is top-right, unreachable one-handed; the one number she'd care about (unread) is a hardcoded lie. Bounces.

**Alex (power user):** clicks "Anuncios activos: 3" — nothing, it's a `<div>`; every drill-down routes back through the sidebar; no shortcuts. A read-only poster, not a control panel.

**Sam (a11y):** tabs and loses the focus ring entirely (none exists); empty-state guidance at ~2.6:1 is unreadable; reduced-motion unhonored. Three AA commitments broken on one screen.

**First-time seller (project persona):** the make-or-break user lands on "0 / 0 € / no messages / no purchases" under "here's what's happening" — where nothing is. No "publish your first item" nudge, no reassurance. Highest-leverage funnel moment wasted.

## Minor Observations

- Two "Publicar" CTAs within ~260px on desktop — dilutes "one loud element per view".
- `getMyWishlist()` awaited but result never used on this screen — dead fetch.
- `.link-more` ("Ver todos →") not styled in this sheet — verify brand color + focus.
- Effect deps include the hook fns; if unmemoized, refetch/flicker each render.
- Activity cards have only an empty variant — they can *only* show emptiness; "Ver todos" previews nothing.

## Questions to Consider

1. Should this be a *dashboard* at all, or an **inbox of things that need me**?
2. What does a seller need at 8am on their phone — four KPIs, or "1 buyer is waiting for your reply"?
3. If you deleted the stat grid + both empty cards and shipped just greeting + real action prompts, would anything of value be lost — or would it stop looking generated?
