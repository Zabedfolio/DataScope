---
name: premium-frontend-ui
description: 'A comprehensive guide for an AI coding assistant to craft high-performance web experiences with balanced motion, typography, design tokens, and architectural craftsmanship across public and enterprise application surfaces.'
metadata:
  author: 'Utkarsh Patrikar (Adapted for DataScope)'
  author_url: 'https://github.com/utkarsh232005'
---

# Immersive & Enterprise Frontend UI Craftsmanship

As an AI engineering assistant, your role when building frontend experiences goes beyond outputting functional HTML and CSS. You must architect high-performance, aesthetically intentional digital environments tailored strictly to the context of each surface.

---

## 0. Scope & Surface Boundary (MANDATORY)

DataScope is an enterprise data discovery and intelligence platform. Visual and architectural rules vary strictly by application surface:

### 0.1 Public Surfaces (Landing Page, Marketing, Lightly on Auth Pages)
- The immersive, narrative-driven rules described in Sections 1–4 (preloader, hero typography engine, subtle noise overlays, staggered entrances, magnetic accents, and smooth scrolling via `lenis`) apply **ONLY** to public marketing pages (such as the Landing page) and, in minimal form, to Login/Register pages.

### 0.2 Authenticated Application Surfaces (STRICTLY FORBIDDEN)
- The immersive marketing rules are **STRICTLY FORBIDDEN** in all authenticated application pages—specifically the **Data Explorer, Search & Filter Builder, Saved Views, Record Details, and Analytics Dashboards**.
- In authenticated surfaces, do NOT include:
  - Custom cursors or mouse-following tracking elements
  - Smooth-scrolling libraries (`lenis` or similar scroll-hijacking libraries)
  - Pinned or horizontal scroll-hijacking sequences
  - Magnetic button physics
  - Full-screen preloader overlays
  - Atmospheric noise/grain blend filters
  - Decorative continuous animations or unprompted parallax

### 0.3 Design System & Token Authority
- **Single Source of Truth**: The color palette, spacing, typography scales, shadows, and semantic tokens must come directly from `docs/DESIGN_ARCHITECTURE.md`.
- Never invent colors, hex codes, or arbitrary layout tokens ad hoc. Always reference the designated CSS custom properties and Tailwind utility classes defined in the design architecture specification.

---

## 1. Application UI Rules (Authenticated Pages)

For authenticated pages (Data Explorer, Dataset Library, Search, Saved Views, Analytics, Settings):

1. **Dense, Calm, and Data-First**:
   - Maximize information density without clutter. The interface chrome must remain quiet, clean, and secondary to the dataset records and analytic charts.
2. **Instant & Fast Perceived Performance**:
   - Zero layout shift (CLS = 0). Containers, data tables, and drawer side-panels must have deterministic dimensions.
3. **Skeleton Loading Over Spinners**:
   - Use content-shaped skeleton screens with subtle shimmer instead of blocking center spinners or blank screens.
4. **Functional Motion Only**:
   - No decorative motion. Limit animations strictly to functional state feedback:
     - Drawer slides / panel collapses: 150ms – 200ms (`cubic-bezier(0.16, 1, 0.3, 1)`)
     - Popover / dropdown / tooltip fades: 100ms – 150ms
     - Table row highlights: 150ms ease-out
5. **Keyboard First & Screen-Reader Accessible**:
   - Full keyboard navigability: Arrow navigation in data tables, `Space` for row selection, `Enter` to open record details, `Esc` to close drawers/dialogs, `Cmd/Ctrl + K` for command palette.
6. **Accessibility & Reduced Motion**:
   - `prefers-reduced-motion` must be respected everywhere. Under reduced motion, all transition durations drop to 0ms.
   - All interactive elements must maintain strict WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components).

---

## 2. Public Pages: Establishing the Creative Foundation

For public marketing pages (Landing Page), commit to a strong editorial identity:
- **Editorial Data Aesthetic**: High-contrast petrol and saffron palette, crisp typography, clean grid lines, and interactive mock data explorations.
- **Cinematic & Controlled Pacing**: Full-viewport hero narrative, structured negative space, and scroll-dependent product demonstrations.

---

## 3. Structural Requirements for Public UI

When scaffolding public marketing surfaces:

### 3.1 The Entry Sequence
- A blank screen is unacceptable. Handle asset resolution gracefully.
- Output code that transitions the initial viewport fluidly—such as a subtle opacity crossfade or staggered heading reveal.

### 3.2 The Hero Architecture
- The top fold must command attention immediately.
- **Visuals**: Full-bleed containers (`100vh` / `100dvh`).
- **Typography Engine**: Ensure headlines are broken down syntactically (e.g., span wrapping by word or character) to allow for cascading entrance animations.
- **Depth**: Utilize subtle floating elements or background clipping paths to create a sense of scale and depth behind the primary copy.

### 3.3 Fluid & Contextual Navigation
- Output sticky headers that react to scroll direction (hide on scroll down, reveal on scroll up).
- Include hover states that reveal rich content or quick jump links.

---

## 4. Public Motion Design System

For marketing surfaces only:

### 4.1 Scroll-Driven Narratives
- Generate code utilizing modern scroll libraries (like GSAP's ScrollTrigger or Framer Motion) to tie animations to user progress.
- **Pinned Containers**: Create sections that lock into the viewport while secondary mock data flows past or reveals itself.
- **Horizontal Journeys**: Translate vertical scroll data into horizontal movement for specific feature showcases or workflow galleries.
- **Parallax Mapping**: Assign subtle, varying scroll-speeds to background elements, midground text, and foreground illustrations.

### 4.2 High-Fidelity Micro-Interactions (Public Only)
- **Magnetic Components**: Write logic that calculates the distance between the mouse pointer and call-to-action buttons, pulling the button towards the cursor dynamically.
- **Custom Tracking Elements**: Generate custom cursor components that follow the mouse with calculated interpolation (lerp) for a smooth drag effect on landing demos.
- **Dimensional Hover States**: Use CSS Transforms (`scale`, `translate3d`) to give interactive cards tactile feedback.

---

## 5. Typography & Visual Texture

- **Type Hierarchy**: Enforce clear contrast in scale. Headlines on landing pages may utilize fluid clamp sizing (`clamp(2.5rem, 5vw, 4.5rem)`), while authenticated app typography uses predictable, fixed scale tokens.
- **Font Selection**:
  - Display (Landing/Hero titles): Bricolage Grotesque
  - UI Sans (Everyday interface): Geist Sans
  - Monospace (Data cells, IDs, numbers, queries): Geist Mono / JetBrains Mono
- **Atmospheric Filters**: On marketing pages only, subtle SVG/CSS noise overlays (`mix-blend-mode: overlay`, opacity `0.02 - 0.04`) may be used to remove digital sterility. Never apply to application data grids.
- **Lighting & Glass**: Utilize `backdrop-filter: blur(8px)` combined with ultra-thin, semi-transparent borders for floating headers or elevated command palettes.

---

## 6. The Performance Imperative (Universal - Applies Everywhere)

A site or application that stutters is a failure. Enforce strict performance guardrails in all generated code:

- **Hardware Acceleration**: Only animate properties that do not trigger layout recalculations: `transform` and `opacity`. Code that animates `width`, `height`, `top`, or `margin` should be fiercely avoided.
- **Render Optimization**: Apply `will-change: transform` intelligently on complex moving elements, but remove it post-animation to conserve memory.
- **Responsive Degradation**: Wrap custom cursor logic and heavy hover animations in `@media (hover: hover) and (pointer: fine)` to ensure pristine performance on touch devices.
- **Accessibility**: Wrap heavy continuous animations in `@media (prefers-reduced-motion: no-preference)`. Never sacrifice user accessibility for aesthetic flair.

---

## 7. Implementation Ecosystem

When implementing these patterns, leverage industry-standard libraries tailored to the framework:

### For React / Next.js Targets
- Structure the application to support **Framer Motion** for layout transitions and spring physics on public pages.
- Recommend **lenis** for smooth scrolling context on marketing pages.
- Implement **React Three Fiber** (`@react-three/fiber`) only if 3D data visualizers are explicitly requested for public demos.
- Use **TanStack Virtual** and **TanStack Table** for high-density, performant application data grids.

### For Vanilla / HTML / Astro Targets
- Rely on **GSAP** (GreenSock Animation Platform) for timeline sequencing on marketing sites.
- Utilize vanilla **lenis** via CDN for scroll smoothing on public pages.
- Use **SplitType** for safe, accessible typography chunking.

---

## 8. Summary of Action

Whenever generating code for DataScope:
1. Identify the surface boundary: **Public Marketing** vs. **Authenticated App**.
2. For **Public Pages**: Apply the immersive, smooth-scrolled, narrative-driven visual hierarchy.
3. For **App Pages**: Apply dense, calm, keyboard-accessible, zero-CLS layout standards with strict token adherence.
4. Pull all colors, tokens, and font choices directly from `docs/DESIGN_ARCHITECTURE.md`.
5. Ensure 100% adherence to WCAG 2.1 AA accessibility and performance budgets.
