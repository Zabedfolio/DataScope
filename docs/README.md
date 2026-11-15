# DataScope Architectural Documentation Index

This directory contains the canonical architectural specifications, system designs, frontend and backend blueprints, data structures, and operational roadmaps for **DataScope**—an enterprise-grade Data Discovery and Intelligence Platform. These documents serve as the single source of truth for technical engineering, user experience implementation, and verification standards.

---

## Table of Contents

1. [Document Catalog & Reading Order](#document-catalog--reading-order)
2. [Document Status Overview](#document-status-overview)
3. [Global Architectural Principles](#global-architectural-principles)
4. [Enterprise Glossary](#enterprise-glossary)
5. [Cross-Document Consistency Standards](#cross-document-consistency-standards)

---

## Document Catalog & Reading Order

For engineers, technical leads, and evaluators, the recommended sequential reading order is designed to build understanding from high-level product design down to concrete execution details:

1. [docs/README.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/README.md) – Global index, document catalog, and enterprise glossary.
2. [docs/DESIGN_ARCHITECTURE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DESIGN_ARCHITECTURE.md) – Core design philosophy, "Petrol & Saffron" design tokens, typography, application shell, detailed Data Explorer anatomy, component catalog, and accessibility standards.
3. [docs/SYSTEM_DESIGN.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SYSTEM_DESIGN.md) – Multi-tier architecture, client vs. server topology, search request lifecycle, scalability roadmap (100K to 10M records), and failure modes.
4. [docs/FRONTEND_ARCHITECTURE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/FRONTEND_ARCHITECTURE.md) – Next.js App Router layer architecture, feature-based modular directory tree, Server/Client component decision matrix, error boundaries, and memoization rules.
5. [docs/STATE_MANAGEMENT.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/STATE_MANAGEMENT.md) – Strict state categorization (Redux, RTK Query, URL, Component), Redux slice specifications, and canonical URL query serialization.
6. [docs/DATA_FETCHING.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DATA_FETCHING.md) – RTK Query caching topology, tag invalidation maps, network failure recovery, debounce policies, and explicit answers to all 10 mandatory architectural questions.
7. [docs/SEARCH_ARCHITECTURE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SEARCH_ARCHITECTURE.md) – PostgreSQL Trigram and FTS vs. Elasticsearch evaluation, query grammar validation, parameterized SQL generation, pagination counts, and result highlighting.
8. [docs/DATABASE_DESIGN.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DATABASE_DESIGN.md) – Entity-Relationship model, dynamic record storage (Hybrid Typed + JSONB), indexing strategies, cursor vs. offset pagination, and 100K+ seed generation.
9. [docs/API_DESIGN.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/API_DESIGN.md) – RESTful API conventions, request/response envelope schemas, rate limiting, and comprehensive endpoint catalogs.
10. [docs/SECURITY_AND_AUTH.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SECURITY_AND_AUTH.md) – Better Auth integration, RBAC matrix, dataset-level authorization gates, CSRF/CORS policies, and security threat mitigations.
11. [docs/TESTING_AND_PERFORMANCE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/TESTING_AND_PERFORMANCE.md) – Test pyramid coverage matrix, empirical benchmark plans (100K/1M), load profiling, and CI/CD pipelines.
12. [docs/DECISION_RECORDS.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DECISION_RECORDS.md) – Architectural Decision Records (ADRs) documenting rationale, trade-offs, and performance implications across key technical choices.
13. [docs/IMPLEMENTATION_ROADMAP.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/IMPLEMENTATION_ROADMAP.md) – Phased milestone delivery plan, risk mitigation register, scoring rubric alignment, and technical video demonstration script.
14. [docs/AGENT_RULES.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/AGENT_RULES.md) – Mandatory constraints and operational governance for autonomous coding agents operating within the repository.

---

## Document Status Overview

| Document | Primary Owner | Target Audience | Current Status |
| :--- | :--- | :--- | :--- |
| [`docs/README.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/README.md) | Lead Architect | All Engineers & Reviewers | **Draft / Approved Specification** |
| [`docs/DESIGN_ARCHITECTURE.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DESIGN_ARCHITECTURE.md) | Product Designer / Frontend Lead | UI/UX Engineers, Full-Stack Devs | **Draft / Approved Specification** |
| [`docs/SYSTEM_DESIGN.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SYSTEM_DESIGN.md) | Principal Systems Architect | Backend & DevOps Engineers | **Draft / Approved Specification** |
| [`docs/FRONTEND_ARCHITECTURE.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/FRONTEND_ARCHITECTURE.md) | Frontend Lead | Frontend Engineers | **Draft / Approved Specification** |
| [`docs/STATE_MANAGEMENT.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/STATE_MANAGEMENT.md) | Frontend Architect | Frontend Engineers | **Draft / Approved Specification** |
| [`docs/DATA_FETCHING.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DATA_FETCHING.md) | Full-Stack Architect | Frontend & Backend Engineers | **Draft / Approved Specification** |
| [`docs/SEARCH_ARCHITECTURE.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SEARCH_ARCHITECTURE.md) | Search / Database Specialist | Backend & Data Engineers | **Draft / Approved Specification** |
| [`docs/DATABASE_DESIGN.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DATABASE_DESIGN.md) | Lead Database Engineer | Backend & Data Engineers | **Draft / Approved Specification** |
| [`docs/API_DESIGN.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/API_DESIGN.md) | Backend Lead | Full-Stack & API Integrators | **Draft / Approved Specification** |
| [`docs/SECURITY_AND_AUTH.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SECURITY_AND_AUTH.md) | Security Officer / Architect | All Engineers | **Draft / Approved Specification** |
| [`docs/TESTING_AND_PERFORMANCE.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/TESTING_AND_PERFORMANCE.md) | QA Lead / Performance Engineer | Test Automation Engineers | **Draft / Approved Specification** |
| [`docs/DECISION_RECORDS.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DECISION_RECORDS.md) | Architecture Review Board | Tech Leads, Stakeholders | **Draft / Approved Specification** |
| [`docs/IMPLEMENTATION_ROADMAP.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/IMPLEMENTATION_ROADMAP.md) | Project Manager / Tech Lead | Engineering Team, Stakeholders | **Draft / Approved Specification** |
| [`docs/AGENT_RULES.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/AGENT_RULES.md) | System Governance | AI Agents & Automation Harvesters | **Draft / Approved Specification** |

---

## UI Component Implementation Registry

As UI components and layout infrastructure are created, they are audited and cataloged here in adherence to the living documentation mandate:

| Component | Path | Status | Verification |
| :--- | :--- | :--- | :--- |
| `Navbar` | `frontend/src/components/layout/Navbar/Navbar.tsx` | **Implemented & Verified** | Floating obsidian-slate pill design, Next.js 15 build + Vitest passing |
| `NavBrand` | `frontend/src/components/layout/Navbar/NavBrand.tsx` | **Implemented & Verified** | Official logo `/datascope.png` + "DataScope" title |
| `NavLinks` | `frontend/src/components/layout/Navbar/NavLinks.tsx` | **Implemented & Verified** | Desktop links with `#00D69A` indicator & `aria-current="page"` |
| `NavActions` | `frontend/src/components/layout/Navbar/NavActions.tsx` | **Implemented & Verified** | Log In button + brand gradient Get Started CTA |
| `MobileMenu` | `frontend/src/components/layout/Navbar/MobileMenu.tsx` | **Implemented & Verified** | Off-canvas drawer with logo, Escape key & light dismiss |
| `Hero` | `frontend/src/features/landing/components/Hero.tsx` | **Implemented & Verified** | "The Data Bloom" editorial hero banner, Vitest passing |
| `HeroContent` | `frontend/src/features/landing/components/HeroContent.tsx` | **Implemented & Verified** | Bricolage headline, eyebrow pill, gradient CTA |
| `HeroArt` | `frontend/src/features/landing/components/HeroArt.tsx` | **Implemented & Verified** | Responsive <picture> (desktop 16:9 / mobile 4:5 WebP & AVIF), LCP priority |
| `HeroVisualStage` | `frontend/src/features/landing/components/HeroVisualStage.tsx` | **Implemented & Verified** | Parallax & floating drift orchestrator |
| `FloatingCard` | `frontend/src/features/landing/components/FloatingCard.tsx` | **Implemented & Verified** | Glassmorphic mock telemetry cards (Card A & Card B) |

---

## Global Architectural Principles

All architectural choices across DataScope are guided by five fundamental pillars:

1. **Data Density with Calm Authority**:
   DataScope is an enterprise discovery platform, not a generic SaaS landing page. Chrome is subdued, margins are functional, and tabular density is prioritized while maintaining crisp readability and strict WCAG 2.1 AA compliance.
2. **Predictable State Hierarchy**:
   Every state element lives in exactly one tier: URL state for shareable explorations, RTK Query cache for server data, Redux slices for transient client workflows, and React local state for isolated component interactions.
3. **Defense-in-Depth Security**:
   The client interface is treated as entirely untrusted. All dataset permissions, role validations, parameter bounds, and field projections are enforced deterministically at the Express API and PostgreSQL query engine layers.
4. **Sub-Second Perceived Latency at Scale**:
   Architectural patterns are engineered to remain responsive from 100K records to 10M records using GIN trigram indexes, cursor/capped pagination, virtualization, and aggressive request deduplication.
5. **Zero Hallucinated Performance Claims**:
   All latency, throughput, and rendering metrics are stated as strict **Targets** that must be validated through reproducible automated benchmarks (k6, EXPLAIN ANALYZE, Lighthouse) rather than assumed theoretical victories.

---

## Enterprise Glossary

To ensure absolute semantic alignment across engineering teams and documentation, the following terms carry specific, immutable definitions within the DataScope ecosystem:

### Dataset
A distinct logical entity collection representing a specific business domain (e.g., `Enterprise Accounts`, `Transactions`, `Healthcare Encounters`). Every dataset has a defined schema of typed fields, access control policies, and underlying record storage.

### Field & Field Metadata
An individual attribute of a dataset (e.g., `revenue`, `status`, `created_at`). Field metadata defines the physical and logical data type (`text`, `number`, `boolean`, `date`, `currency`, `enum`), filterability, sortability, and display configuration.

### Record
A single atomic data item belonging to a dataset. In DataScope, records are stored in a high-performance hybrid model combining core typed identity columns (`id`, `dataset_id`, `created_at`, `updated_at`) with dynamic indexed payload attributes in a PostgreSQL `JSONB` structure.

### View (Saved View)
A named, persisted snapshot of an exploration session containing a specific dataset ID, active search query, filter condition tree, multi-sort definitions, visible column layout, column ordering, and density mode. Views can be private to a user or shared with the organization.

### Filter Condition
An atomic predicate tuple composed of:
$$\text{Condition} = (\text{field}, \text{operator}, \text{value})$$
where the operator is strictly typed against the field definition (e.g., `gte`, `contains`, `between`, `in`).

### Filter Group
A logical collection of filter conditions joined together by a single boolean operator (`AND` or `OR`). Filter groups can be recursively nested to express complex multi-tier analytical criteria.

### Keyset Cursor
A deterministic, opaque pointer representing a record's unique position in a sorted result set. Used in cursor-based pagination, typically formed by encoding the tuple of the sorted column values and the unique primary key:
$$\text{Cursor} = \text{base64}(\text{sort\_value} \parallel \text{id})$$

### Server State
Data owned, persisted, and managed by the remote database and backend API. In the frontend, server state is mirrored and cached exclusively using RTK Query with deterministic cache tag invalidation.

### Client State
Transient UI state that belongs strictly to the user's current session or window. Managed via Redux Toolkit slices (e.g., active drawer states, selected rows, UI preferences).

### URL State
The canonical representation of the active exploration session stored in the browser's URL query string. The URL query string is the single source of truth for the Data Explorer; modifying a filter updates the URL, which subsequently triggers an RTK Query re-fetch.

### Trigram Index (`pg_trgm`)
A PostgreSQL indexing technique that breaks text into sequences of three consecutive characters, enabling ultra-fast substring searches (`ILIKE '%query%'`) and typo-tolerant similarity matches using Generalized Inverted Indexes (GIN).

### Virtualization
A frontend rendering optimization pattern (TanStack Virtual) where only the table rows currently visible within the viewport (plus a small overscan buffer) are mounted into the DOM, maintaining 60 FPS scrolling regardless of whether the dataset contains 25 or 100,000 cached records.

---

## Cross-Document Consistency Standards

When cross-referencing between architectural documents, the following naming conventions are strictly enforced:

- **Redux Slice Names**: `authSlice`, `datasetSlice`, `searchConfigSlice`, `savedViewsSlice`, `uiPreferenceSlice`.
- **Query Parameter Names**: `dataset`, `q`, `filters`, `sort`, `page`, `pageSize`, `cols`, `view`.
- **Database Tables**: `user`, `session`, `account`, `verification` (Better Auth), `roles`, `datasets`, `dataset_fields`, `dataset_records`, `record_relationships`, `saved_views`, `search_history`, `user_preferences`, `access_permissions`.
- **Backend Endpoints**: Versioned under `/api/v1/` prefix (e.g., `/api/v1/datasets`, `/api/v1/records/search`).
- **Primary Design Tokens**: `--background`, `--surface`, `--sidebar`, `--border`, `--foreground`, `--muted-foreground`, `--primary`, `--primary-hover`, `--secondary`, `--row-selected`, `--highlight`.

