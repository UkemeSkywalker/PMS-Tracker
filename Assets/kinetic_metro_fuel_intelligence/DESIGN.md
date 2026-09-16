---
name: Kinetic Metro Fuel Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737687'
  outline-variant: '#c3c5d8'
  surface-tint: '#0051e0'
  primary: '#0042ba'
  on-primary: '#ffffff'
  primary-container: '#0357ee'
  on-primary-container: '#dde2ff'
  inverse-primary: '#b5c4ff'
  secondary: '#515e7e'
  on-secondary: '#ffffff'
  secondary-container: '#cdd9ff'
  on-secondary-container: '#525f7f'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00164d'
  on-primary-fixed-variant: '#003cac'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b9c6ec'
  on-secondary-fixed: '#0c1b38'
  on-secondary-fixed-variant: '#394665'
  tertiary-fixed: '#ffe085'
  tertiary-fixed-dim: '#e8c349'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-price-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-price-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system lives at the intersection of high-trust institutional fintech and the kinetic, fast-moving energy of Lagos urban transit. It is built to serve daily commuters, commercial bus operators (danfos), haulage drivers, and fleet managers navigating volatile fuel availability and fluctuating Premium Motor Spirit (PMS) prices.

The aesthetic fuses **Modern Neo-Fintech** with high-clarity **Mobility Utility**:
- **Utilitarian Speed:** Immediate legibility of fuel rates (₦/L) under direct equatorial sunlight. Glanceable hierarchy prioritizes pump status, queue severity, and timestamped verification.
- **Institutional Confidence:** Robust, polished surfaces anchored in deep midnight navy and electric blue that evoke the operational reliability of financial infrastructure.
- **Urban Tactility:** Generous touch surfaces (minimum 48px tap footprints) engineered for single-handed use inside jolting vehicles or walking through crowded forecourts.
- **Visual Tone:** Forward-looking, crisp, and authoritative. Avoids ornamental fluff in favor of structural clarity, high-contrast numeric data displays, and reassuring verification accents.

## Colors

The palette balances authoritative financial blue tones with high-visibility accents calibrated for critical field alerts and monetary precision.

### Functional Roles
- **Primary Blue (`#0357EE`):** The operational core. Drives primary calls to action, selected interactive states, active route overlays, and core brand anchoring.
- **Dark Navy / Midnight (`#02102D`):** The typographic anchor and high-emphasis canvas. Used for primary numeric displays (rates per litre), dominant headers, and contrasting bottom sheets.
- **Sky Blue (`#55C0F9`):** Accent highlights, active live telemetry indicators, secondary progress bars, and map radial radar sweeps.
- **Warm Accent Yellow (`#FFD85C`):** High-alert visibility for surge warnings, queue delays, crowd-sourced caution flags, and star ratings.
- **Success Emerald (`#10B981`):** Verified pump availability, verified POS active status, and positive price dips.
- **Muted Slate (`#64748B`):** Secondary metadata, inactive icons, timestamps, and address sublines.
- **Surface Background (`#F8FAFC`):** Soft canvas tint reducing eye fatigue under bright light while ensuring pure white cards float effortlessly.
- **Card Surface (`#FFFFFF`):** High-focus containment layer for stations, analytics, and transaction cards.
- **Subtle Border (`#E2E8F0`):** Razor-thin separation for card borders and list divisions without creating visual friction.

## Typography

The type hierarchy balances high-personality geometric impact for quantitative data with clinical legibility for navigation and transactional reports.

- **Plus Jakarta Sans:** Drives headline titles, section breaks, station names, and large currency metrics. The geometric circular counters provide warmth while maintaining a bold, contemporary fintech presence.
- **Inter:** The workhorse for all situational UI metadata, location addresses, crowd-sourced reports, and status notifications. Configured with tabular figures (`tnum`) across all tabular rows, fuel metrics, and odometer/litre tallies.
- **Naira Currency Representation:** All fuel rates format the currency symbol (`₦`) alongside numerical figures with negative letter spacing (`-0.02em`) to guarantee quick recognition in dense card feeds.

## Layout & Spacing

This design system uses a strictly disciplined 4px base spatial unit engineered around mobile viewports (360px to 428px base widths) while remaining fluid across larger form factors.

### Viewport Architecture
- **Mobile First (Single-Column Fluid):**
  - Horizontal canvas margins: `16px` (`margin`).
  - Inter-card vertical rhythm: `12px` to `16px` (`space-md`).
  - Internal card padding: `16px` to `20px`.
  - Floating bottom action bar offset: `16px` clearance above the safe-area inset.
- **Tablet / Responsive Fold (Two-Column Master-Detail):**
  - Margins expand to `24px`.
  - Station list / live feed docks on a fixed 380px left rail; map canvas scales infinitely across the remaining viewport.

### Ergonomics
All primary interactive targets conform to a minimum height and width of `48px`. Key decision triggers—such as "Report Price", "Navigate", or "Filter Pumps"—are anchored in the bottom 40% of the screen within thumb reach to facilitate one-handed operation on the move.

## Elevation & Depth

Visual hierarchy uses a refined ambient layering model that blends soft tinted shadows with hairline structural borders.

### Elevation Levels
- **Ground (Level 0):** `#F8FAFC`. Background canvas base for maps, scrolling views, and settings backplates.
- **Level 1 (Default Cards & Tiles):** `#FFFFFF` surface accompanied by a 1px continuous stroke of `#E2E8F0` and an ambient glow:
  - `box-shadow: 0 4px 16px -2px rgba(2, 16, 45, 0.04), 0 1px 2px 0 rgba(2, 16, 45, 0.02)`
- **Level 2 (Active Stations & Selected Filters):**
  - `box-shadow: 0 8px 24px -4px rgba(3, 87, 238, 0.08), 0 2px 6px -1px rgba(2, 16, 45, 0.04)`
  - Used for top-rated fuel stations, active search fields, and expanded station cards.
- **Level 3 (Modals & Draggable Drawers):**
  - `box-shadow: 0 20px 32px -8px rgba(2, 16, 45, 0.16)`
  - Reserved for fuel submission sheets, fuel station operational verification dialogs, and map bottom sheets.

Surface boundaries never rely purely on drop shadows; pairing subtle `#E2E8F0` borders with soft colored shadows maintains contrast under harsh outdoor lighting.

## Shapes

The shape language reflects an approachable, tactile geometry with rounded radii applied systematically according to scale:

- **Buttons & Search Inputs:** Pill-shaped (`9999px`) or `16px` rounded rectangles, offering clear ergonomics.
- **Cards & Data Modules:** Smooth `16px` to `24px` outer radii (`rounded-lg` to `rounded-xl`).
- **Pill Badges & Chips:** Full pill radius (`9999px`) for verified indicators, operational status flags, and price chips.
- **Progress & Metric Trackers:** Fully rounded stroke ends (`rounded-full`) for queue gauges and fuel availability bars.

## Components

### Buttons
- **Primary Button:** Filled `#0357EE` with high-contrast pure white text (`label-lg`). Height is 52px on mobile; fully rounded (`9999px`) or `16px` radius. Hover/active states tint downward to `#0242B5`.
- **Secondary / Surface Button:** Pure white fill with `#E2E8F0` hairline border and `#02102D` text. Emits Level 1 elevation on press.
- **Destructive / Alert Action:** `#FEE2E2` background with `#DC2626` text for reporting incorrect station data or out-of-stock fuel.

### Chips & Micro-Badges
- **Verified Status Badge:** Pill shape with `#10B981` tint background (`12%` opacity) paired with solid `#059669` text, accompanied by a 12px checkmark icon.
- **Queue Indicator Chip:**
  - *Light queue:* `#ECFDF5` background, `#047857` text.
  - *Moderate queue:* `#FFFBEB` background, `#B45309` text.
  - *Heavy queue:* `#FEF2F2` background, `#B91C1C` text.
- **Fuel Type Selector:** Segmented pill toggle with active selection elevated via pure white card surface and `#02102D` label.

### Input Fields & Search
- **Forecourt Search Bar:** 52px height, white background, `16px` corner radius, surrounded by a `#E2E8F0` border with Level 1 elevation. Contains a search icon in `#64748B` and clear text trigger. Active focus switches the stroke to `#0357EE` with a 3px soft blue glow (`rgba(3, 87, 238, 0.12)`).

### Station Cards
- High-emphasis information architecture:
  - Top line: Station Brand (e.g., "TotalEnergies - Lekki Phase 1") paired with distance ("1.2 km").
  - Hero figure: Large bold metric display (`display-price-mobile`, `#02102D`) featuring the Naira value (e.g., `₦680`) and `/L` suffix in `#64748B`.
  - Middle row: Queue status badge, Moniepoint POS verified payment badge, and crowd-sourced timestamp ("Updated 4m ago").
  - Footer action: Split-row container with quick "Directions" and "Confirm Price" buttons.

### Lists & Activity Feeds
- Edge-to-edge content separated by clean `1px` `#E2E8F0` dividers inset by `16px`. Tabular pricing rows align numeric data to the right using `Inter` with tabular figures enabled.