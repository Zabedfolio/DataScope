# DataScope Design System & User Interface Architecture

This document establishes the comprehensive design philosophy, visual design language, token specifications, layout geometry, application shell mechanics, component library specifications, and page-by-page blueprints for **DataScope**. It serves as the primary visual and structural contract for all frontend engineering across public marketing surfaces and dense authenticated enterprise application screens.

---

## Table of Contents

1. [Design Philosophy & Product Personality](#1-design-philosophy--product-personality)
2. [Color System: "Petrol & Saffron"](#2-color-system-petrol--saffron)
3. [Typography Engine](#3-typography-engine)
4. [Spatial Grid, Elevation & Geometric Radii](#4-spatial-grid-elevation--geometric-radii)
5. [Application Shell & Layout Architecture](#5-application-shell--layout-architecture)
6. [Data Explorer: The Centerpiece Specification](#6-data-explorer-the-centerpiece-specification)
7. [Comprehensive Page-by-Page Blueprints](#7-comprehensive-page-by-page-blueprints)
8. [Public Marketing & Authentication Experience](#8-public-marketing--authentication-experience)
9. [Enterprise Component Inventory](#9-enterprise-component-inventory)
10. [Functional Motion & Transition Physics](#10-functional-motion--transition-physics)
11. [Accessibility & Assistive Technology Standards](#11-accessibility--assistive-technology-standards)
12. [Iconography, Microcopy & Empty-State Voice](#12-iconography-microcopy--empty-state-voice)
13. [Responsive Adaptation Matrix](#13-responsive-adaptation-matrix)

---

## 1. Design Philosophy & Product Personality

DataScope is an enterprise-grade data discovery, querying, and intelligence platform. It rejects the bubbly, pastel-toned, low-density aesthetics of consumer web applications. Instead, DataScope embraces an **editorial, authoritative data workshop aesthetic**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      DATASCOPE PRODUCT PERSONALITY                     │
├───────────────────┬───────────────────────────────┬────────────────────┤
│ Editorial Rigor   │ Technical Density             │ Subdued Chrome     │
│ Crisp typography, │ Maximum data-to-ink ratio;    │ Navigation elements│
│ high-contrast     │ tabular numerals, dense grids,│ recede into the    │
│ lines, quiet depth│ instant keystroke responses   │ background; data is│
│ without noise.    │ without decorative clutter.   │ the primary hero.  │
└───────────────────┴───────────────────────────────┴────────────────────┘
```

### Core Design Principles
1. **Data First, Chrome Quiet**: The user is here to inspect, slice, and understand massive datasets. Every pixel dedicated to padding, oversized navigation banners, or decorative widgets is a pixel stolen from tabular analysis.
2. **One Signal Accent Color (Saffron)**: Saffron (`#F2A20C` / `#FFB520`) is strictly reserved for high-signal interactive states—active filters, primary call-to-actions, selection indicators, and critical query highlights. Secondary navigation relies on deep petroleum teal.
3. **Density with Utmost Clarity**: Information density is achieved through rigorous mathematical alignment, micro-borders, and typographic hierarchy—never through cramped text or visual overcrowding.
4. **Zero Layout Shift & Predictable Layouts**: The application geometry is fixed. The sidebar, top bar, toolbar, and table container maintain deterministic dimensions to eliminate Cumulative Layout Shift (CLS = 0).
5. **Perceived Instantaneous Latency**: Through content-conforming skeleton screens, local query caching, debounced inputs, and optimistic UI updates, the interface responds to user intent with zero perceptible lag.

---

## 2. Color System: Modern Mint Emerald (#00D69A) & Deep Slate

The visual foundation of DataScope is built upon the bespoke **Mint Emerald & Deep Slate** palette. It pairs a high-vibrancy primary theme color (`#00D69A`) with crisp white elevated surfaces, slate typography, and subtle neutral borders.

### 2.1 Color Tokens Table

| Token Identifier | CSS Custom Variable | Value | Semantic Intent |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `--background` | `#F8FAFC` (Slate Tint) | Root page background |
| **Surface Element** | `--surface` | `#FFFFFF` (Pure White) | Cards, floating navbar, tables, drawers |
| **Sidebar Canvas** | `--sidebar` | `#0B1924` (Abyssal Slate) | Application navigation rail |
| **Structural Border** | `--border` | `#E2E8F0` (Slate Line) | Floating navbar borders, table dividers |
| **Text Primary** | `--foreground` | `#0F172A` (Slate Ink) | Headers, cell values, primary labels |
| **Text Muted** | `--muted-foreground` | `#64748B` (Muted Slate) | Secondary nav, timestamps, placeholders |
| **Primary Accent** | `--primary` | `#00D69A` (Mint Emerald) | Theme color: brand accents, active indicators, CTA |
| **Primary Hover** | `--primary-hover` | `#00BF89` (Deep Mint) | Primary interactive hover states |
| **Secondary Accent** | `--secondary` | `#0B2530` (Petrol Slate) | Secondary buttons, header tags, badges |
| **Row Selected** | `--row-selected` | `#E6FAF4` (Mint Frost) | Selected rows, table row active state |
| **Search Highlight** | `--highlight` | `#B3F5DF` (Mint Glow) | Text match highlight in search queries |
| **Status: Success** | `--success` | `#00D69A` (Mint Green) | Active records, successful jobs |
| **Status: Warning** | `--warning` | `#F59E0B` (Amber Fire) | Degraded state, pending review |
| **Status: Danger** | `--danger` | `#EF4444` (Crimson Rose) | Errors, failed migrations, deletes |
| **Status: Info** | `--info` | `#0EA5E9` (Sky Blue) | Informational tags, system notices |

### 2.2 Analytical Chart Palette
For multi-series categorical visualization in Analytics and Dashboard widgets, the following fixed sequence must be strictly used:
1. `Series 1 (Primary Teal)`: `#0E7C86`
2. `Series 2 (Saffron)`: `#F2A20C`
3. `Series 3 (Crimson)`: `#C8344A`
4. `Series 4 (Indigo)`: `#5B6CCF`
5. `Series 5 (Olive Sage)`: `#7FA650`
6. `Series 6 (Plum Amethyst)`: `#9A6FB0`

### 2.3 The 70 / 20 / 10 Balance Rule
Every page layout must respect the visual weight distribution:
- **70% Neutrals**: `--background`, `--surface`, and `--border`. These create the calm editorial reading plane.
- **20% Deep Petrol / Slate**: `--sidebar`, text primary, and table headers. These ground the structural hierarchy.
- **10% Saffron & Semantic Accents**: Reserved solely for selected items, primary actions, and critical notifications.

### 2.4 WCAG 2.1 AA Contrast Audits & Compensations

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    WCAG 2.1 AA ACCESSIBILITY AUDIT PASS                    │
├──────────────────────────┬──────────┬────────┬─────────────────────────────┤
│ Color Pair               │ Ratio    │ Grade  │ Required Design Rule        │
├──────────────────────────┼──────────┼────────┼─────────────────────────────┤
│ Ink Slate on Parchment   │ 12.8:1   │ AAA    │ Default body text pass      │
│ Slate Ash on Parchment   │ 4.62:1   │ AA     │ Muted metadata pass         │
│ Saffron (#F2A20C) on #FFF│ 1.84:1   │ FAIL   │ NEVER use saffron for text! │
│ Ink Slate on Saffron     │ 9.12:1   │ AAA    │ Always use dark text on     │
│                          │          │        │ saffron buttons & badges    │
│ Deep Teal (#0E7C86) on #F│ 4.95:1   │ AA     │ Link and focus ring pass    │
│ Crisp Chalk on Dark Petrl│ 14.1:1   │ AAA    │ Dark mode default text pass │
└──────────────────────────┴──────────┴────────┴─────────────────────────────┘
```

> [!CAUTION]
> **Saffron Text Violation**: Yellow and saffron hues inherently fail contrast against light surfaces. Never render bare text in saffron on a light surface. Primary buttons with saffron backgrounds must render button labels in dark ink slate (`#10242B`) with `font-semibold`.

### 2.5 Theme Switching Implementation
Theme switching is managed through a persistent `data-theme="light | dark"` attribute mounted on the document `<html>` root. The state is governed by Redux `uiPreferenceSlice` and mirrored to an `httpOnly` cookie / `localStorage` to eliminate flash of unstyled theme (FOUT).

```css
/* Tailwind CSS Root Variable Injections */
:root, [data-theme="light"] {
  --background: 42 27% 94%;       /* #F6F2EA */
  --surface: 43 100% 99%;         /* #FFFDF8 */
  --sidebar: 194 68% 14%;         /* #0B2F3A */
  --border: 41 26% 85%;           /* #E3DCCD */
  --foreground: 196 46% 12%;      /* #10242B */
  --muted-foreground: 191 9% 46%; /* #6B7B7F */
  --primary: 39 90% 50%;          /* #F2A20C */
  --primary-hover: 39 100% 43%;   /* #D98F00 */
  --secondary: 185 81% 29%;       /* #0E7C86 */
  --row-selected: 42 85% 91%;     /* #FBEFD3 */
  --highlight: 44 100% 77%;       /* #FFE08A */
}

[data-theme="dark"] {
  --background: 194 57% 7%;       /* #08181D */
  --surface: 194 51% 11%;         /* #0E242B */
  --sidebar: 198 62% 6%;          /* #06141A */
  --border: 196 43% 19%;          /* #1B3A44 */
  --foreground: 165 20% 93%;      /* #EAF1EF */
  --muted-foreground: 188 15% 61%;/* #8FA7AB */
  --primary: 39 100% 56%;         /* #FFB520 */
  --primary-hover: 41 100% 65%;   /* #FFC84D */
  --secondary: 185 61% 47%;       /* #2FB5C0 */
  --row-selected: 195 48% 17%;    /* #173842 */
  --highlight: 44 100% 24%;       /* #7A5A00 */
}
```

---

## 3. Typography Engine

Typography in DataScope establishes immediate hierarchy between high-level editorial narrative and granular technical records.

### 3.1 Typeface Selection & Font Loading
1. **Display Font: Bricolage Grotesque** (Google Font)
   - *Scope*: Landing page hero titles, marketing headings, and major application page titles only.
   - *Rationale*: A modern neo-grotesque font with expressive optical weight adjustments that conveys high editorial authority.
   - *Loading*: Instantiated using `next/font/google` with `display: 'swap'` and `subsets: ['latin']`.
2. **Interface UI Font: Geist Sans** (Vercel Font)
   - *Scope*: All application navigation, toolbars, modal copy, form controls, and general text.
   - *Rationale*: Ultra-neutral, legible at 11px and 12px micro-sizes, designed specifically for dense web tool engineering.
   - *Fallback*: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
3. **Data & Monospace Font: Geist Mono / JetBrains Mono**
   - *Scope*: Primary Keys, IDs, timestamps, numeric records, currency values, SQL preview snippets, and query builder chips.
   - *Rationale*: Perfect tabular alignment, unambiguous glyphs (0 vs O, 1 vs l), and native tabular numerals (`font-variant-numeric: tabular-nums`).

### 3.2 Full Enterprise Type Scale

| Token Name | Font Family | Size (rem / px) | Weight | Line Height | Tracking | Primary Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-2xl` | Bricolage | `3.5rem / 56px` | 700 Bold | 1.1 | -0.03em | Landing page hero |
| `display-xl` | Bricolage | `2.5rem / 40px` | 700 Bold | 1.15 | -0.02em | Marketing section headers |
| `heading-lg` | Bricolage | `1.75rem / 28px`| 600 Semi | 1.25 | -0.015em| Page titles (Explorer, Library)|
| `heading-md` | Geist Sans | `1.25rem / 20px`| 600 Semi | 1.3 | -0.01em | Modal titles, drawer headers |
| `heading-sm` | Geist Sans | `1.0rem / 16px` | 600 Semi | 1.4 | 0 | Widget titles, group headers |
| `body-base` | Geist Sans | `0.875rem / 14px`| 400 Regular | 1.5 | 0 | Default body text, forms |
| `body-medium` | Geist Sans | `0.875rem / 14px`| 500 Medium | 1.5 | 0 | Table header labels, button text|
| `data-table` | Geist Sans | `0.8125rem / 13px`| 400 Regular | 1.35 | 0 | Standard table text cells |
| `data-mono` | Geist Mono | `0.8125rem / 13px`| 400 Regular | 1.35 | 0 | IDs, numeric cells, timestamps |
| `caption-sm` | Geist Sans | `0.75rem / 12px`| 400 Regular | 1.4 | +0.01em | Meta tags, breadcrumbs |
| `micro-badge` | Geist Mono | `0.6875rem / 11px`| 600 Semi | 1.2 | +0.04em | Status pill text, count badges |

> [!IMPORTANT]
> **Mandatory Tabular Numerals**: In CSS, all `.data-table-cell`, `.mono-value`, and `.stat-number` classes must enforce `font-feature-settings: "tnum" 1, "cv05" 1;` so numbers remain geometrically aligned across table rows.

---

## 4. Spatial Grid, Elevation & Geometric Radii

### 4.1 Spatial Rhythm Scale
DataScope operates on a strict **4px baseline sub-grid**:
- `space-1`: `4px` (tight badge padding, inline icon spacing)
- `space-2`: `8px` (button inline gap, filter chip gaps)
- `space-3`: `12px` (toolbar padding, form element vertical padding)
- `space-4`: `16px` (card content padding, drawer padding)
- `space-6`: `24px` (page canvas margin, section separators)
- `space-8`: `32px` (dashboard grid gaps)

### 4.2 Restrained Radii Scale
To preserve the professional, sharp editorial feel, curved borders are restrained:
- `radius-none`: `0px` (tables, table headers, sticky columns)
- `radius-sm`: `3px` (badges, data chips, micro buttons)
- `radius-md`: `5px` (standard input fields, default buttons, dropdown panels)
- `radius-lg`: `8px` (cards, modal dialogs, drawer panels)
- *Note: Pill radii (`9999px`) are forbidden except for status dot indicators.*

### 4.3 Elevation & Shadow Hierarchy
DataScope prioritizes crisp 1px structural borders over heavy diffuse shadows.
- `elevation-0`: No shadow; bounded solely by `border: 1px solid var(--border)` (standard cards, data table).
- `elevation-1`: `0 1px 3px rgba(11, 47, 58, 0.08)` (dropdown menus, popover tooltips).
- `elevation-2`: `0 4px 16px -2px rgba(11, 47, 58, 0.14)` (command palette, slide-out drawer).
- `elevation-3`: `0 12px 32px -4px rgba(11, 47, 58, 0.22)` (modal dialogs).

### 4.4 Table Density Modes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TABLE DENSITY STANDARDS                         │
├───────────────┬────────────┬──────────────┬────────────────────────────┤
│ Mode          │ Row Height │ Cell Padding │ Ideal Use Case             │
├───────────────┼────────────┼──────────────┼────────────────────────────┤
│ Comfortable   │ 44px       │ 12px X, 10px Y│ Large displays, exploratory│
│ Compact (Def) │ 32px       │ 8px X, 6px Y │ Standard analysis, 100K+   │
└───────────────┴────────────┴──────────────┴────────────────────────────┘
```

---

## 5. Application Shell & Layout Architecture

The application shell provides the structural frame for all authenticated workflows. It contains four core components: the Collapsible Sidebar, the Top Utility Bar, the Workspace Breadcrumb, and the Active View Port.

### 5.1 Desktop Shell Wireframe

```
+---------------------------------------------------------------------------------------------------------+
| [LOGO] DataScope   | Path: Enterprise / Customers / [Active View v] | (Cmd+K) Search... | [T] [N] [User]|
+--------+------------------------------------------------------------------------------------------------+
| (Coll) | DATASET: Customer Master 2026 [Switch v] | 104,230 Records | Sync: 2m ago       | [Export] [+] |
|        +------------------------------------------------------------------------------------------------+
| [Nav]  | [ Search records... (q) ] [ + Add Filter ] [ Status = Active x ] [ Revenue > 10K x ] [Cols v] |
| Overvw | [Saved Views: Default | EMEA Accounts* | High Value Q3 | + New View ]          [Density: Cmpv] |
| Datast +---+-------------------+--------------------+-------------------+---------------+---------------+
| Explor |[x]| Record ID (PK)    | Company Name       | Account Status    | Annual Rev    | Created Date  |
| Search +---+-------------------+--------------------+-------------------+---------------+---------------+
| Saved  |[_]| REC-00984102      | Acme Corp GmbH     | [ Active ]        | $ 420,000.00  | 2026-10-12    |
| Anlytc |[_]| REC-00984103      | Cyberdyne Systems  | [ Pending ]       | $  18,500.00  | 2026-10-13    |
|        |[_]| REC-00984104      | Wayne Enterprises  | [ Active ]        | $1,890,000.00 | 2026-10-14    |
| [Adm]  |[_]| REC-00984105      | Stark Industries   | [ Active ]        | $9,400,000.00 | 2026-10-14    |
| Users  |   |                   |                    |                   |               |               |
| Settng +---+-------------------+--------------------+-------------------+---------------+---------------+
| [v]    | Selected: 0 of 104,230 records   | < Prev  Page [  1 ] of 4,170  Next >   | Rows/Page: [25 v]  |
+--------+------------------------------------------------------------------------------------------------+
```

### 5.2 Mobile Shell Wireframe (Drawer Off-Canvas)

```
+-------------------------------------------------------+
| [=] DataScope | Customers [v]       [(Q)] [Theme] [U] |
+-------------------------------------------------------+
| [ Search in 104,230 records...                      ] |
| [ Filter (2 active) v ]  [ Saved Views v ] [ Sort v ] |
+-------------------------------------------------------+
| CARD: Acme Corp GmbH                                  |
| ID: REC-00984102 | Status: [ Active ]                 |
| Annual Revenue: $420,000.00 | Created: 2026-10-12     |
+-------------------------------------------------------+
| CARD: Cyberdyne Systems                               |
| ID: REC-00984103 | Status: [ Pending ]                |
| Annual Revenue: $18,500.00  | Created: 2026-10-13     |
+-------------------------------------------------------+
| [ < Prev ]   Page 1 of 4,170 records   [ Next > ]     |
+-------------------------------------------------------+
```

### 5.3 Sidebar Navigation Specifications
- **Dimensions**:
  - Expanded: `240px` fixed width.
  - Collapsed: `56px` fixed width (icons only with hover tooltip).
  - Mobile (`< 768px`): `0px` default; slides in as an off-canvas drawer (`280px`) with overlay backdrop.
- **Visual Styling**:
  - Background: `--sidebar` (`#0B2F3A` Light / `#06141A` Dark).
  - Border Right: `1px solid var(--border)`.

### 5.4 Global Floating Obsidian-Slate Navbar & Mobile Navigation Drawer Specification
The global header (`Navbar`) is implemented in `frontend/src/components/layout/Navbar/` as an elevated floating obsidian-slate pill designed to maximize contrast for the official brand logo (`/datascope.png`):

```
frontend/src/components/layout/Navbar/
├── Navbar.tsx             # Floating pill container: sticky top-4, slate-900 backdrop, soft ambient shadow
├── NavBrand.tsx           # Official logo (/datascope.png) with drop-shadow + "DataScope" title
├── NavLinks.tsx           # Desktop navigation links with #00D69A indicator (aria-current="page")
├── NavActions.tsx         # Action cluster: Theme CTA button (Sign In) in #00D69A
├── MobileMenu.tsx         # Accessible off-canvas mobile drawer with hamburger trigger
├── index.ts               # Public component exports
└── Navbar.test.tsx        # Vitest & Testing Library unit tests
```

#### Structural & Behavioral Characteristics
1. **Floating Geometry & High-Contrast Elevation**:
   - Elevated pill container: `sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8` with `max-w-7xl mx-auto`.
   - Visual Treatment: `bg-slate-900/95 backdrop-blur-md`, subtle `border border-slate-800/80`, `rounded-2xl` geometric radius, and deep ambient shadow (`shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.15)]`).
   - Pointer Events: Outer container has `pointer-events-none` with `pointer-events-auto` on the pill to prevent blocking underneath content outside the floating bar.
2. **Branding & Logo Contrast Optimization**:
   - Official brand symbol: `/datascope.png` (high-resolution transparent PNG) loaded via Next.js `Image` at `36px` (`w-9 h-9`) with subtle `drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]` and `priority` for immediate paint.
   - Contrast Rationale: Because the official logo features white dimensional curl highlights along the right rim of the "D" alongside mint-green bars, the deep obsidian-slate navbar background (`#0F172A` / `#0B151E`) ensures both the white curvature (21:1 contrast) and the `#00D69A` bars (9.5:1 contrast) stand out with razor-sharp fidelity without washing out.
   - Brand typography: "DataScope" displayed directly beside the logo in bold `tracking-tight text-white`.
3. **Action Cluster & Brand Gradient (`NavActions.tsx`)**:
   - **Log In Button**: Secondary action styled as a clean text/ghost button (`text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl`).
   - **Get Started CTA Button**: High-impact primary action powered by the brand gradient derived directly from the logo: `bg-gradient-to-r from-[#00F5A0] via-[#00D69A] to-[#00B884]`. Features subtle interactive hover translation (`hover:-translate-y-0.5`), dynamic chevron arrow nudge, and glowing emerald shadow (`shadow-[0_2px_14px_rgba(0,214,154,0.35)] hover:shadow-[0_4px_22px_rgba(0,214,154,0.55)]`). Text is high-contrast `text-slate-950 font-bold`.
   - Desktop Navigation Links: `text-slate-300 hover:text-white`, with active route highlighted by `text-white font-bold bg-slate-800/80` and a luminous `#00D69A` bottom pill indicator.
4. **Accessibility (`WCAG 2.1 AA`)**:
   - Semantic `<header role="banner">` and `<nav aria-label="...">` landmarks.
   - Hamburger toggle features dynamic `aria-expanded` and `aria-controls="mobile-nav-drawer"`.
   - Off-canvas mobile drawer panel has `role="dialog"`, `aria-modal="true"`, and `aria-label="Mobile Navigation Menu"`.
   - **Keyboard Navigation**: Pressing `Escape` instantly dismisses the mobile drawer and returns focus to the trigger button.
   - **Backdrop Light Dismiss**: Clicking outside the drawer on the backdrop closes the menu.
   - **Scroll Lock**: The document body scrolling is locked (`overflow: hidden`) while the drawer is open.
5. **Motion Constraints**:
   - Purely functional 150ms–200ms transitions (`transition-transform`, `transition-opacity`). No decorative bounce or spring animations.
   - Fully disabled when `@media (prefers-reduced-motion: reduce)` is active.
  - Active Nav Item: Highlighted with a `3px` solid saffron left indicator bar (`#F2A20C`), text color `--surface`, and background tint `rgba(242, 162, 12, 0.08)`.
- **Navigation Groups**:
  - **Core**: Overview (`/`), Dataset Library (`/datasets`), Data Explorer (`/explorer`), Advanced Search (`/search`).
  - **Workspaces**: Saved Views (`/views`), Search History (`/history`), Analytics (`/analytics`).
  - **Management**: User Settings (`/settings`), System Administration (`/admin/*` - role-gated).

---

## 6. Data Explorer: The Centerpiece Specification

The Data Explorer is the technical heart of DataScope. It is designed to navigate datasets containing between 100K and 10M records with zero frame dropping.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATA EXPLORER COMPONENT TOPOLOGY                     │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Dataset Header Toolbar (Dataset Selector, Record Count, Sync Age)    │
│ 2. Universal Query & Filter Bar (Search Input, Filter Chips, Modal Btn) │
│ 3. Saved View Tab Strip (Persistent Views, Create New Tab, Share)       │
│ 4. Table Command Bar (Column Manager, Density Toggle, Batch Operations) │
│ 5. Virtualized Data Grid (Sticky Header, Frozen PK Column, Resize)      │
│ 6. Pagination & Selection Summary Footer (Cursor / Offset Controls)     │
│ 7. Slide-Out Record Detail Drawer (Metadata, JSON Inspector, History)   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.1 Virtualized Data Grid Spec
- **Rendering Mechanism**: TanStack Virtual (`@tanstack/react-virtual`) operating inside a fixed-height parent container.
- **Row Heights**: Fixed `32px` (Compact) or `44px` (Comfortable). Dynamic variable row heights are strictly forbidden to ensure deterministic $O(1)$ virtual scroll offset calculations.
- **Zebra Striping Decision**:
  - **Decision: NO ZEBRA STRIPING**.
  - **Justification**: In high-density financial and technical tables, alternating background fills create horizontal banding noise that competes with status badges, row selections, and search match highlights. Row boundaries are defined purely by clean `1px solid var(--border)` horizontal rules.
- **Hover & Selection States**:
  - Row Hover: Background changes to `var(--surface)` with `150ms` ease.
  - Row Selected: Background shifts to `var(--row-selected)` (`#FBEFD3` Light / `#173842` Dark) with a 2px solid saffron left border.
- **Column Customization**:
  - Draggable column re-ordering via header drag handles.
  - Column width resize handles with double-click auto-fit calculation.
  - Frozen Column: Column 0 (Checkbox) and Column 1 (Record PK Identifier) remain permanently frozen (`position: sticky; left: 0; z-index: 20`).

### 6.2 Cell Type Formatting Rules

| Data Type | Alignment | Font Style | Null Representation | Example Output |
| :--- | :--- | :--- | :--- | :--- |
| **UUID / PK** | Left | Geist Mono, Muted | `—` | `REC-90812` |
| **Plain Text** | Left | Geist Sans | `—` (in italic ash) | `Acme International Inc` |
| **Numeric Value** | Right | Geist Mono, Tabular | `0` (or `—`) | `14,250` |
| **Currency** | Right | Geist Mono, Tabular | `$0.00` | `$ 1,420,500.00` |
| **Timestamp / Date**| Left | Geist Mono | `—` | `2026-11-13 14:15 UTC` |
| **Boolean** | Center | Custom Icon | `—` | `[✓]` (Emerald) / `[✕]` (Carmine) |
| **Enum Status** | Center | Micro Badge | `Unknown` | `[ Active ]` (Forest Green Pill) |
| **Long Text** | Left | Geist Sans, Truncate | `—` | `Detailed memo discussing...` |

### 6.3 Multi-Column Sort UI
- Columns display subtle sort direction indicators (`↑`, `↓`, `↕`).
- Shift-clicking column headers adds secondary and tertiary sorting criteria.
- When multi-sort is active, a numeric index badge (`1`, `2`, `3`) appears directly beside the directional arrow to clarify precedence.

### 6.4 Worked UI Example (Brief Scenario)
*Scenario*: User queries for **Status = Active**, **Country = Germany**, **Revenue > 10,000**, and **Created = Last 30 Days**.

```
+-------------------------------------------------------------------------------------------------------+
| Filter Bar:                                                                                           |
| [Q Search keyword...] | [Status: Active x] [Country: DE x] [Revenue > $10,000 x] [Created: 30d x]   |
+-------------------------------------------------------------------------------------------------------+
```
- **Filter Chip Anatomy**:
  - `Status: Active` (Field: Saffron text, Value: Ink Slate, trailing `✕` removes filter).
  - Clicking any chip opens a targeted popover editor for that specific attribute without launching the full builder modal.
- **URL Synchronization**:
  ```
  /explorer?dataset=customers&filters=%7B%22and%22%3A%5B%7B%22field%22%3A%22status%22%2C%22op%22%3A%22eq%22%2C%22val%22%3A%22Active%22%7D%2C%7B%22field%22%3A%22country%22%2C%22op%22%3A%22eq%22%2C%22val%22%3A%22Germany%22%7D%2C%7B%22field%22%3A%22revenue%22%2C%22op%22%3A%22gt%22%2C%22val%22%3A10000%7D%2C%7B%22field%22%3A%22created_at%22%2C%22op%22%3A%22gte%22%2C%22val%22%3A%22NOW-30D%22%7D%5D%7D
  ```

### 6.5 Record Detail Drawer
- Sliders out from the right viewport boundary (`width: 480px` on desktop, `100vw` on mobile).
- **Header**: Record PK identifier, status badge, copy link button, and close (`Esc`) button.
- **Tabs**:
  1. `Overview`: Key fields grouped by category.
  2. `All Attributes`: Complete key-value tabular tree with search filter.
  3. `JSON Inspector`: Raw syntax-highlighted JSONB payload with one-click copy.
  4. `Relationships`: Inbound/outbound foreign key references (e.g., Orders by this Customer).
  5. `Audit History`: Chronological timeline of mutations, field diffs, and actor signatures.
- **Keyboard Traversal**: While drawer is open, `J` moves to the next record, and `K` moves to the previous record in the table without closing the drawer.

---

## 7. Comprehensive Page-by-Page Blueprints

### 7.1 Landing Page (`/`)
- **Purpose**: Editorial product narrative introducing DataScope's instant discovery capabilities.
- **Access**: Public.
- **Key Components**: Sticky editorial header, fluid display hero, mock interactive virtualized grid demo (pure static client-side state), feature cards, architecture callout, CTA footer.
- **Data Requirements**: Pure static assets; zero database calls.

### 7.2 Authentication: Login & Register (`/login`, `/register`)
- **Purpose**: Secure credential-based session authentication via Better Auth.
- **Access**: Public / Unauthenticated only.
- **Layout**: Center-card split view (editorial testimonial left, clean form card right).
- **Key Components**: Email input, password input with show/hide toggle, submit button, OAuth buttons (optional), error alert banner.
- **Data Requirements**: Calls `/api/auth/sign-in/email` and `/api/auth/sign-up/email`.

### 7.3 Overview Dashboard (`/dashboard`)
- **Purpose**: High-level system vitals, recently queried datasets, and saved view shortcuts.
- **Access**: Authenticated (Viewer, Analyst, Admin).
- **Layout Wireframe**:
  ```
  +-------------------------------------------------------------------------+
  | [Stat: Total Records] | [Stat: Active Datasets] | [Stat: Queries Today] |
  +-------------------------------------------------+-----------------------+
  | Top Datasets by Activity (Table)                | Saved Views Quick-Jump|
  +-------------------------------------------------+-----------------------+
  | Recent Search History (Feed)                    | System Health Banner  |
  +-------------------------------------------------------------------------+
  ```
- **Data Requirements**: Calls `/api/v1/analytics/overview` (Server-rendered initial shell, client polling).

### 7.4 Dataset Library (`/datasets`)
- **Purpose**: Catalog of all available data sources, schemas, and metadata descriptions.
- **Access**: Authenticated (All roles).
- **Key Components**: Search input, tag filter pills, grid/table view toggle, dataset card with record counts and schema fields.
- **Data Requirements**: Calls `/api/v1/datasets`.
- **States**: Skeleton grid during load; empty state offering "Request Dataset Access" if none available.

### 7.5 Data Explorer (`/explorer`)
- **Purpose**: The primary workstation for filtering, searching, and exporting records.
- **Access**: Authenticated (Viewer, Analyst, Admin).
- **Key Components**: Outlined extensively in Section 6.
- **Data Requirements**: Calls `/api/v1/datasets/:id/records` with query params.

### 7.6 Advanced Search & Query Builder (`/search`)
- **Purpose**: Dedicated canvas for composing deeply nested boolean queries across multiple datasets.
- **Access**: Authenticated (Analyst, Admin).
- **Key Components**: Visual block-based query tree builder, raw SQL preview pane, dataset cross-join selector, execute query button.
- **Data Requirements**: Calls `/api/v1/search/validate` and `/api/v1/search/execute`.

### 7.7 Saved Views Management (`/views`)
- **Purpose**: Gallery and management console for private and team-shared exploration views.
- **Access**: Authenticated (All roles).
- **Key Components**: Search bar, view cards (showing name, creator, filter summary, record count badge), edit/delete/share actions.
- **Data Requirements**: Calls `/api/v1/saved-views`.

### 7.8 Search History & Audit Log (`/history`)
- **Purpose**: Chronological log of all queries executed by the user with execution latency and count metrics.
- **Access**: Authenticated (All roles).
- **Key Components**: Filter by date, re-run query button, export query logs.
- **Data Requirements**: Calls `/api/v1/search/history`.

### 7.9 Analytics & Aggregations (`/analytics`)
- **Purpose**: Visual trend exploration, distributions, and cross-tabulations of dataset fields.
- **Access**: Authenticated (Analyst, Admin).
- **Key Components**: Metric card builder, time-series line chart, categorical bar breakdown, correlation matrix.
- **Data Requirements**: Calls `/api/v1/analytics/aggregate`.

### 7.10 User Settings & Preferences (`/settings`)
- **Purpose**: User profile management, theme selection, default table density mode, and API keys.
- **Access**: Authenticated (All roles).
- **Key Components**: Profile form, density radio group, theme picker (Light, Dark, System), password change modal.
- **Data Requirements**: Calls `/api/v1/preferences`.

### 7.11 Admin: User & Permission Management (`/admin/users`, `/admin/permissions`)
- **Purpose**: Role assignment (Viewer, Analyst, Admin) and dataset-level Access Control List (ACL) configuration.
- **Access**: Administrator ONLY (strictly RBAC enforced).
- **Key Components**: User data table, role dropdown select, dataset permission matrix (Read, Write, Export, Manage).
- **Data Requirements**: Calls `/api/v1/admin/users` and `/api/v1/admin/permissions`.

---

## 8. Public Marketing & Authentication Experience

In strict accordance with [`SKILL.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/SKILL.md), public marketing surfaces leverage immersive visual storytelling while authenticated app pages remain dense and functional.

### 8.1 Landing Page Architecture: Centered Isometric Architecture Hero (#00D69A Theme)
The landing page hero is implemented in `frontend/src/features/landing/components/` following a clean, centered technical architecture inspired by modern engineering systems (e.g., CyberNest reference), highlighting DataScope's data ingestion, storage engine, and query visualization pipeline:

```
frontend/src/features/landing/
├── components/
│   ├── Hero.tsx               # Server Component shell (centered layout, responsive container)
│   ├── CenteredHeroHeader.tsx # Centered eyebrow, two-tone fluid headline, subtext, dual CTAs
│   ├── IsometricDataStage.tsx # Client Component (interactive stage, perspective tilt, telemetry badges)
│   ├── IsometricDataEngine.tsx# Scalable vector isometric pipeline diagram (DB tower, core drive, cards)
│   ├── Hero.test.tsx          # Vitest unit test suite (6 passing assertions)
│   └── index.ts               # Public exports
└── constants/
    └── hero.ts                # Centralized, editable copy and telemetry constants
```

#### 1. Concept & Visual Art Direction ("Isometric Architecture")
- **Visual Narrative**: An engineering-grade architectural visualization of DataScope's data pipeline drawn in precise isometric projection ($30^\circ / 150^\circ$ coordinate axes):
  - **Database Cluster Tower (Left)**: Stacked isometric storage server blocks with segment seams and glowing emerald (`#00D69A`) status LEDs.
  - **Mechanical & Silicon Data Engine (Center)**: Open drive chassis with circular platter, center spindle, mechanical actuator read head, microchip pins, and circuit traces.
  - **Barcode & Sensor Card (Center-Left)**: Precision blueprint card with vertical barcode lines, input nodes, and status indicators.
  - **Data Explorer Sheet (Foreground-Right)**: Floating application sheet with window header, column grid ("A"), pie chart visualization, and toggle switches.
  - **Connective Traces**: Orthogonal isometric bus paths with circular terminal solder pins in `#00D69A` and animated traveling data packets.
- **Palette**: Strictly bound to brand theme tokens:
  - Brand Emerald `#00D69A` (`--primary`) & Mint Glow `#00F5A0` for active traces, illuminated spindle, and badges.
  - Dark Slate `#06141A` (`--primary-foreground`) ensuring > 8.5:1 WCAG AAA text contrast.
  - Airy Mint `#F8FAF9` (`--background` in light mode) & Deep Obsidian `#061114` (dark mode).
  - Slate `#0B2026` / `#334155` for high-precision technical linework.

#### 2. Centered Typographic Hierarchy (`CenteredHeroHeader.tsx`)
- **Eyebrow**: `"DATA DISCOVERY & INTELLIGENCE ARCHITECTURE"` (pill badge with pulsing `#00D69A` node).
- **Two-Tone Headline**:
  - Primary (Bold): `"Discover enterprise data"`
  - Secondary (Contrast): `"with intelligent "` + `<span className="font-serif italic text-slate-400">and automated precision</span>`
- **Subtext**: `"DataScope indexes raw data streams into structured intelligence. Search, filter, and inspect complex enterprise datasets with sub-millisecond precision without writing complex pipelines."`
- **CTAs**: Primary gradient pill `"Get Started"` (`/register`) matching navbar CTA + secondary outline glass pill `"Learn More"` (`/login`).

#### 3. Responsive Behavior & Performance
- **Zero Raster Asset Bloat**: Replaced heavy raster images with a pure scalable vector SVG (`IsometricDataEngine.tsx`), resulting in instantaneous loading (0 bytes downloaded for images, infinite 4K resolution clarity).
- **Perspective Tilt & Motion**: Desktop pointer-driven subtle 3D tilt ($\pm 2^\circ$), disabled when `prefers-reduced-motion: reduce` is active.
- **Fluid Scaling**: Headline scales with `clamp(2.4rem, 5.2vw, 4.25rem)` with zero horizontal overflow at 320px.

#### 6. Restrained Motion Physics
- **Entry**: Staggered fade and rise (transform & opacity only) across eyebrow (0ms), headline lines (100ms, 200ms), subtext (300ms), CTAs (400ms), and cards (500–650ms).
- **Card Drift**: Slow ambient floating drift loops (7.5s for Card A, 9.0s for Card B) using `translate3d`.
- **Pointer Parallax**: Desktop-only (±6px to ±12px) active strictly under `@media (hover: hover) and (pointer: fine)`.
- **Reduced Motion**: Instant static display when `prefers-reduced-motion: reduce` is detected. No preloaders or custom cursors.

### 8.2 Authentication Screen Restraint
- `/login` and `/register` do **NOT** include smooth-scroll hijacking, 3D canvases, or distracting magnetic cursor physics.
- Motion is limited strictly to a subtle 150ms opacity transition on form error messages and a calm background grid canvas.

---

## 9. Enterprise Component Inventory

The following catalog establishes the atomic UI components constructed with headless primitives (Radix UI / Tailwind CSS):

| Component Name | Structural Purpose | Primary Variants | Key Accessibility Notes |
| :--- | :--- | :--- | :--- |
| `Button` | Interactive action trigger | `primary` (saffron), `secondary` (petrol), `outline`, `ghost`, `danger` | Keyboard focus ring (`--secondary`), `aria-disabled` |
| `IconButton` | Compact icon-only action | `ghost`, `outline` (28px, 32px, 36px) | Mandatory `aria-label` attribute |
| `Input` | Textual data entry | `default`, `error`, `mono` (code/numbers) | Associated `<label>`, `aria-invalid`, `aria-describedby` |
| `SearchInput` | Debounced text filter | `compact` (toolbar), `hero` (command bar) | Keyboard shortcut badge (`/`), clear button |
| `Select` | Single-option menu | `standard`, `compact-table` | Radix Select primitive, full arrow key navigation |
| `Combobox` | Searchable dropdown | `single`, `multi-select` | Virtualized options for >100 entries, ARIA combobox |
| `DatePicker` | Calendar date selector | `single-date`, `relative-preset` | Focus trapping, screen-reader date announcement |
| `DateRangePicker` | Temporal boundary filter | `preset` (7d, 30d, 90d), `custom-range` | Accessible dual calendar grid |
| `NumberRangeInput`| Numeric range filter | `slider+inputs`, `min-max-inputs` | Validates `min <= max`, tabular numerals |
| `Checkbox` | Boolean / Row select | `default`, `indeterminate` | Native keyboard toggle (`Space`), `aria-checked` |
| `Switch` | Boolean system toggle | `sm`, `md` | Radix Switch primitive, role `switch` |
| `Badge` | Metadata tag / Status pill| `success`, `warning`, `danger`, `info`, `neutral` | High-contrast text, non-color status icon |
| `FilterChip` | Applied filter indicator | `active`, `pending-edit` | Dismissible via `Backspace` or `✕` click |
| `FilterBuilder` | Query condition tree | `modal`, `inline-bar` | Nested AND/OR grouping, keyboard traversable |
| `ColumnManager` | Visible column selector | `popover-checklist` | Drag-and-drop reorder, select all / reset |
| `Pagination` | Table navigation footer | `offset-pages`, `cursor-infinite` | Announce "Page X of Y" via `aria-live="polite"` |
| `DataTable` | Virtualized grid canvas | `compact`, `comfortable` | ARIA grid, row selection, column headers |
| `Drawer` | Slide-out side panel | `right-sheet` (480px) | Focus trap, `Esc` dismiss, scroll lock |
| `Navbar` | Floating obsidian-slate responsive header | `floating-pill` | WCAG AA landmark, elevated slate-900 surface, high logo contrast |
| `NavBrand` | Brand identifier & logo | `default` | Accessible home anchor with `/datascope.png` & title |
| `NavLinks` | Desktop navigation links | `inline-cluster` | `aria-current="page"`, `#00D69A` indicator |
| `NavActions` | Action cluster | `flex-row` | Log In button + gradient Get Started CTA |
| `MobileMenu` | Mobile navigation drawer | `off-canvas-sheet` | Accessible hamburger trigger, focus restoration, Escape light-dismiss |
| `Hero` | Landing page hero master section | `responsive-grid` | 100dvh desktop layout, 3-breakpoint responsive art direction |
| `HeroContent` | Hero narrative & dual CTA cluster | `default` | Light-weight Bricolage Grotesque headline, eyebrow pill |
| `HeroArt` | Responsive picture data bloom stage | `picture-canvas` | Desktop (16:9 WebP/AVIF) & mobile (4:5 WebP/AVIF), LCP priority |
| `HeroVisualStage`| Interactive client stage container| `parallax-canvas` | Pointer parallax (desktop), drift loop orchestrator |
| `FloatingCard` | Glassmorphic mock telemetry card | `floating-overlay` | `backdrop-blur-xl`, solid fallback, Card A & Card B variants |
| `Dialog` | Modal confirmation | `standard`, `danger-alert` | Role `dialog`, `aria-modal="true"`, focus return |
| `CommandPalette` | Universal jump box | `modal-overlay` (`Cmd+K`) | Keyboard navigation, fuzzy filter indexing |
| `Skeleton` | Content-shaped loader | `table-row`, `card`, `metric` | `aria-busy="true"`, subtle pulse animation |
| `EmptyState` | No data fallback display | `no-results`, `no-permission`, `empty-set` | Clear next-step CTA button, contextual illustration |

---

## 10. Functional Motion & Transition Physics

Motion in the authenticated DataScope platform is purely utilitarian, engineered to communicate state changes without delaying the user.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FUNCTIONAL MOTION PARAMETERS                      │
├───────────────────────┬──────────┬───────────────────────┬─────────────┤
│ Interaction           │ Duration │ Cubic Bezier Easing   │ Reduced Mot │
├───────────────────────┼──────────┼───────────────────────┼─────────────┤
│ Drawer Slide In/Out   │ 180ms    │ cubic-bezier(0.16,1,0.3,1)│ Instant │
│ Dropdown / Popover    │ 120ms    │ ease-out              │ Instant     │
│ Table Row Selection   │ 100ms    │ ease-out              │ Instant     │
│ Filter Chip Add/Remove│ 150ms    │ cubic-bezier(0.2,0,0,1)│ Instant    │
│ Toast Notification    │ 200ms    │ cubic-bezier(0.16,1,0.3,1)│ Instant │
│ Skeleton Pulse Shimmer│ 1500ms   │ linear (infinite)     │ Static Grey │
└───────────────────────┴──────────┴───────────────────────┴─────────────┘
```

> [!IMPORTANT]
> **Strict Reduced Motion Enforcement**:
> ```css
> @media (prefers-reduced-motion: reduce) {
>   *, *::before, *::after {
>     animation-duration: 0.01ms !important;
>     animation-iteration-count: 1 !important;
>     transition-duration: 0.01ms !important;
>     scroll-behavior: auto !important;
>   }
> }
> ```

---

## 11. Accessibility & Assistive Technology Standards

DataScope enforces full compliance with **WCAG 2.1 Level AA** across all interfaces.

### 11.1 Table Keyboard Navigation Matrix
- `ArrowDown` / `ArrowUp`: Move active cell focus vertically across virtualized table rows.
- `ArrowLeft` / `ArrowRight`: Move active cell focus horizontally across columns.
- `Space`: Toggle checkbox selection for the currently focused row.
- `Shift + Space`: Range-select from the previously selected row to the active row.
- `Enter`: Open the Record Detail Drawer for the currently active row.
- `Cmd/Ctrl + A`: Select all filtered records within the current dataset scope.
- `Escape`: Clear active row selection or dismiss open detail drawer.

### 11.2 Screen Reader Announcements (`aria-live`)
- Search results updates are wired to an invisible live region:
  `<div aria-live="polite" class="sr-only">Showing 25 of 104,230 records matching criteria</div>`
- Filter additions announce:
  `<div aria-live="polite" class="sr-only">Filter Country equals Germany applied. 4,120 records found.</div>`

### 11.3 Non-Color Dependent Status Indication
Status badges must never convey information through color alone. Every status badge must include an explicit text label and an identifiable glyph:
- `Active`: Forest Green background + Checkmark icon (`✓`) + Text "Active".
- `Pending`: Amber background + Clock icon (`◷`) + Text "Pending".
- `Failed`: Crimson background + Alert triangle (`⚠`) + Text "Failed".

---

## 12. Iconography, Microcopy & Empty-State Voice

### 12.1 Icon System: Lucide Icons
- **Selection**: Lucide Icons (`lucide-react`) is the standard iconography package.
- **Sizing Rules**:
  - Micro (inline table indicators): `14px` (stroke width `1.75px`).
  - Standard (buttons, form inputs, nav): `16px` (stroke width `2.0px`).
  - Header / Hero actions: `20px` (stroke width `2.0px`).

### 12.2 Microcopy Voice & Tone
The tone is concise, technical, helpful, and respectful of the user's analytical focus. Avoid playful, apologetic, or overly conversational prose.

**Ten Example Microcopy Strings**:
1. *Search Placeholder*: `"Search 104,230 records by ID, company name, or domain... (/)"`
2. *Empty Filter Results*: `"No records match the active filter criteria. Try broadening your date range or removing constraints."`
3. *Record Selected Banner*: `"24 records selected across 2 pages. [Export CSV] [Bulk Tag] [Clear Selection]"`
4. *Query Execution Error*: `"Query timeout exceeded. The requested filter on 'payload.metadata' is unindexed. Contact admin."`
5. *Save View Success*: `"View 'EMEA High-Value Q3' saved to team library."`
6. *Clipboard Confirmation*: `"Record PK 'REC-90812' copied to clipboard."`
7. *Permission Denied*: `"Restricted dataset. Your role (Viewer) does not permit raw record export."`
8. *Unsaved Changes Warning*: `"You have unsaved filter changes. Leaving now will reset the active exploration view."`
9. *Index Rebuild Notice*: `"Database index optimization in progress for 'Transactions'. Search latency may be temporarily elevated."`
10. *Delete View Confirmation*: `"Permanently delete saved view 'Old Pipeline'? This action cannot be undone."`

---

## 13. Responsive Adaptation Matrix

| UI Component | Desktop (`>= 1024px`) | Tablet (`768px - 1023px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- | :--- |
| **Navigation Sidebar** | `240px` expanded; collapsible | `56px` icon-rail collapsed | `0px` hidden; off-canvas slide drawer |
| **Top Bar** | Full breadcrumb + search input | Compact breadcrumb + search icon | Dataset switcher + modal search icon |
| **Data Explorer Grid** | Virtualized table (all columns) | Virtualized table (horizontal scroll)| Compact Record Cards list |
| **Filter Builder** | Inline chip bar + modal editor | Inline chip bar + modal editor | Bottom sheet filter drawer |
| **Record Detail** | `480px` slide-out right drawer | `400px` slide-out right drawer | Fullscreen sheet (`100vw`) |
| **Column Manager** | Popover dropdown panel | Popover dropdown panel | Bottom modal checklist |
| **Analytics Charts** | 3-column responsive grid | 2-column responsive grid | Single-column stacked cards |

