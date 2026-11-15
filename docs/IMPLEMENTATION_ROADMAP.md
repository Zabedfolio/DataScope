# DataScope Phased Implementation Roadmap & Evaluation Blueprint

This document defines the sequential development phases, milestones, technical deliverables, risk mitigations, scoring rubric alignment, and technical video demonstration script for **DataScope**. It guides engineering teams to build the platform methodically according to architectural specifications.

---

## Table of Contents

1. [Evaluation Criteria & Architectural Weighting](#1-evaluation-criteria--architectural-weighting)
2. [Phased Implementation Roadmap](#2-phased-implementation-roadmap)
3. [Risk Management Register](#3-risk-management-register)
4. [Technical Presentation Video Blueprint & Script](#4-technical-presentation-video-blueprint--script)

---

## 1. Evaluation Criteria & Architectural Weighting

To ensure that engineering effort aligns directly with evaluation standards, every implementation milestone is mapped to the platform's core assessment categories:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SCORING RUBRIC & EFFORT ALLOCATION                   │
├───────────────────────────────────┬────────┬───────────────────────────┤
│ Assessment Category               │ Marks  │ Primary Governing Docs    │
├───────────────────────────────────┼────────┼───────────────────────────┤
│ Data Fetching & Caching Strategy  │ 12 pts │ DATA_FETCHING.md          │
│ Search Architecture & Scalability │ 12 pts │ SEARCH_ARCHITECTURE.md    │
│ Frontend Architecture & UI/UX     │ 9 pts  │ DESIGN_ARCH, FRONTEND_ARCH│
│ State Management & URL Sync       │ 6 pts  │ STATE_MANAGEMENT.md       │
│ Database Schema & Hybrid Storage  │ 6 pts  │ DATABASE_DESIGN.md        │
│ Empirical Performance Verification│ 6 pts  │ TESTING_AND_PERFORMANCE.md│
│ Technical Decision Records (ADRs) │ 6 pts  │ DECISION_RECORDS.md       │
│ Architectural Documentation Depth │ 3 pts  │ Global docs/ Suite        │
├───────────────────────────────────┼────────┼───────────────────────────┤
│ TOTAL EVALUATION BUDGET           │ 60 pts │ 100% Comprehensive Effort │
└───────────────────────────────────┴────────┴───────────────────────────┘
```

---

## 2. Phased Implementation Roadmap

```mermaid
gantt
    title DataScope Phased Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Core Infrastructure
    Phase 0: Workspace Scaffolding & Config (COMPLETED) :done, p0, 2026-11-13, 2026-11-13
    Phase 1: Database Migration & 100K Seed Engine     :active, p1, 2026-11-14, 2026-11-15
    Phase 2: Better Auth & RBAC Security Middleware    :p2, 2026-11-16, 2026-11-17
    section Search & API
    Phase 3: Dataset Catalog & Records API             :p3, 2026-11-18, 2026-11-19
    Phase 4: Parameterized SQL Search Engine (pg_trgm) :p4, 2026-11-20, 2026-11-21
    section Frontend Workstation
    Phase 5: Data Explorer Virtual Grid & Filter Bar   :p5, 2026-11-22, 2026-11-24
    Phase 6: Saved Views, History & URL State Loop     :p6, 2026-11-25, 2026-11-26
    Phase 7: Analytics Visualizations & Aggregates     :p7, 2026-11-27, 2026-11-28
    section Hardening & Delivery
    Phase 8: Bulk CSV Streaming & Async Export Worker  :p8, 2026-11-29, 2026-11-30
    Phase 9: Empirical Benchmark Audits (k6 / EXPLAIN) :p9, 2026-12-01, 2026-12-02
    Phase 10: Production Hardening, Docs & Video Demo  :p10, 2026-12-03, 2026-12-04
```

---

### Detailed Phase Breakdowns

#### Phase 0: Workspace Scaffolding & Configuration (COMPLETED)
- **Goal**: Establish the decoupled Next.js frontend and Express backend repositories with unified tooling.
- **Deliverables**: Root `docker-compose.yml`, `backend/` with Drizzle, Better Auth, Express, and Vitest; `frontend/` with Next.js 15, RTK Query, Tailwind, and StoreProvider.
- **Definition of Done**: Both servers start concurrently (`:5000` and `:3000`), `/api/health` and `/api/auth/ok` respond with 200 OK.

#### Phase 1: Database Migration & 100K+ Seed Engine
- **Goal**: Implement the hybrid relational identity + JSONB storage engine and generate 100,000 realistic enterprise records.
- **Deliverables**: Drizzle migration files in `backend/drizzle/`, `pg_trgm` extension activation, and `backend/src/db/seeds/generate-sample-dataset.ts`.
- **Dependencies**: Phase 0.
- **Definition of Done**: `npm run db:migrate` applies cleanly without error; `npm run db:seed` inserts 100,000 records in $< 15$ seconds.
- **Rubric Marks**: Database Schema (6 pts).

#### Phase 2: Better Auth & RBAC Security Middleware
- **Goal**: Generate Better Auth schemas, wire session cookies, and implement the three-tier RBAC permission middleware.
- **Deliverables**: Better Auth CLI table generation, `requireAuth` and `requireRole` middleware in Express, login and registration forms in frontend.
- **Dependencies**: Phase 1.
- **Definition of Done**: Supertest suite proves Viewers cannot call mutation endpoints (403 Forbidden); session cookies enforce `HttpOnly` and `SameSite`.

#### Phase 3: Dataset Catalog & Metadata APIs
- **Goal**: Deliver CRUD endpoints for datasets, fields, and record relationship metadata.
- **Deliverables**: `/api/v1/datasets`, `/api/v1/datasets/:id/fields`, RTK Query services in `frontend/src/services/datasetsApi.ts`.
- **Dependencies**: Phase 2.
- **Definition of Done**: Frontend Dataset Library renders available datasets with accurate cached record counts.

#### Phase 4: Parameterized SQL Search Engine (`pg_trgm`)
- **Goal**: Implement the AST compiler translating JSON query trees into secure, parameterized PostgreSQL SQL with GIN trigram matching.
- **Deliverables**: `SearchQueryCompiler.ts` in Express backend, composite B-tree indexes, GIN trigram indexes on company name and domain.
- **Dependencies**: Phase 3.
- **Definition of Done**: Unit tests prove 100% parameterization with zero SQL injection risk; queries return matching records in $< 150\text{ms}$ over 100K rows.
- **Rubric Marks**: Search Architecture & Scalability (12 pts).

#### Phase 5: Data Explorer Virtual Grid & Filter Bar
- **Goal**: Build the flagship Data Explorer workstation featuring TanStack Virtual, sticky columns, density toggles, and popover filter chips.
- **Deliverables**: `VirtualTable.tsx`, `FilterBar.tsx`, `RecordDrawer.tsx` in `frontend/src/features/explorer/`.
- **Dependencies**: Phase 4.
- **Definition of Done**: 100K records scroll at a verified 60 FPS without DOM lag; keyboard arrows navigate cells; drawer opens record diffs.
- **Rubric Marks**: Frontend Architecture (9 pts).

#### Phase 6: Saved Views, History & URL State Loop
- **Goal**: Bind the Data Explorer state bidirectionally to browser URL query parameters and implement Saved Views persistence.
- **Deliverables**: `useUrlSync.ts` hook, `saved_views` API, `searchConfigSlice.ts`, share view dialog.
- **Dependencies**: Phase 5.
- **Definition of Done**: Refreshing the browser or sharing a URL reconstructs the exact filter tree, sort order, and column layout with 0 state loss.
- **Rubric Marks**: State Management (6 pts).

#### Phase 7: Analytics Visualizations & Aggregates
- **Goal**: Build aggregate trend charts and distribution breakdowns backed by PostgreSQL materialized views.
- **Deliverables**: `/api/v1/analytics/aggregate`, Materialized view `mv_dataset_analytics_hourly`, Recharts SVG components in `frontend/src/features/analytics/`.
- **Dependencies**: Phase 6.
- **Definition of Done**: Multi-series charts render with the exact Petrol & Saffron palette sequence; p95 latency $< 100\text{ms}$.

#### Phase 8: Bulk CSV Streaming & Async Export Worker
- **Goal**: Enable synchronous chunked CSV streaming for small sets ($\le 10\text{K}$) and asynchronous BullMQ export jobs for massive datasets ($> 10\text{K}$).
- **Deliverables**: Node.js streaming transform pipeline in Express; BullMQ background worker queue.
- **Dependencies**: Phase 7.
- **Definition of Done**: Exporting 100,000 records generates a downloadable CSV without crashing Node.js server heap memory.

#### Phase 9: Empirical Benchmark Audits & Performance Reporting
- **Goal**: Execute rigorous automated load and query benchmarks, recording real metrics into `docs/TESTING_AND_PERFORMANCE.md`.
- **Deliverables**: k6 load test scripts, PostgreSQL `EXPLAIN ANALYZE` query trace logs, Lighthouse lab audit report.
- **Dependencies**: Phase 8.
- **Definition of Done**: All target numbers in the audit sheet are replaced with empirically observed data; p95 search latency $< 150\text{ms}$ proven.
- **Rubric Marks**: Performance Verification (6 pts).

#### Phase 10: Production Hardening, Docs & Video Demo
- **Goal**: Final cross-document consistency pass, production build optimization, and recording the mandatory technical presentation video.
- **Deliverables**: Production Docker deployment scripts, updated `README.md`, recorded 10-minute technical video.
- **Dependencies**: Phase 9.
- **Definition of Done**: Complete repository passes all CI checks cleanly.

---

## 3. Risk Management Register

| Identified Technical Risk | Probability | Severity | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **GIN Index Rebuild Contention** | Low | High | Use `CREATE INDEX CONCURRENTLY` in Drizzle migrations to prevent table write locks. |
| **Deep Offset Pagination Memory Spike** | High | High | Enforce Keyset Cursor pagination beyond Page 50, as specified in ADR-004. |
| **URL Query String Length Overflow** | Medium | Medium | Compress nested filter ASTs using base64 URL-safe encoding; cap condition count at 20. |
| **Browser Virtual Scroll White Flash** | Medium | Low | Configure TanStack Virtual `overscan: 10` rows to buffer scrolling ahead of viewport. |
| **Supabase Free-Tier Egress Exhaustion**| Medium | Medium | Test 100K record benchmarks against local Docker PostgreSQL before executing on cloud. |

---

## 4. Technical Presentation Video Blueprint & Script

The project brief mandates a comprehensive technical presentation video. The outline below details the exact chronological presentation flow and links each segment to the governing architectural document:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                  TECHNICAL VIDEO PRESENTATION TIMELINE (10 MIN)            │
├───────┬───────────────────────────────┬────────────────────────────────────┤
│ Time  │ Presentation Section          │ Reference Document & Key Content   │
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 00:00 │ 1. Architectural Introduction │ SYSTEM_DESIGN.md                   │
│       │ Multi-tier decoupled topology,│ Present high-level architecture    │
│       │ Express API + Next.js App     │ diagram; justify separate Express. │
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 01:30 │ 2. The Hybrid Database Model  │ DATABASE_DESIGN.md                 │
│       │ Relational identity + JSONB   │ Walk through ERD; explain why      │
│       │ Dynamic record persistence    │ hybrid storage beat separate tables│
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 03:00 │ 3. Search Engine & Compilation│ SEARCH_ARCHITECTURE.md             │
│       │ pg_trgm GIN indexes, SQL AST, │ Demonstrate partial match search;  │
│       │ 100% parameterization defense │ show parameterized SQL log in term.│
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 04:30 │ 4. Data Fetching & Caching    │ DATA_FETCHING.md                   │
│       │ RTK Query normalized cache,   │ Answer 10 brief questions; show    │
│       │ request deduplication & abort │ DevTools request deduplication.    │
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 06:00 │ 5. State Management & URL Loop│ STATE_MANAGEMENT.md                │
│       │ URL as single source of truth,│ Copy URL, open in incognito window,│
│       │ Redux slices, zero re-renders │ prove exact view restoration.      │
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 07:30 │ 6. Flagship Data Explorer Demo│ DESIGN_ARCHITECTURE.md             │
│       │ Virtualized 60 FPS scrolling, │ Live demo of brief scenario:       │
│       │ filter chips, detail drawer   │ Status=Active, Germany, Rev>10K.   │
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 08:45 │ 7. Empirical Performance Proof│ TESTING_AND_PERFORMANCE.md         │
│       │ k6 benchmark results, EXPLAIN │ Display real benchmark numbers;    │
│       │ query plans over 100K rows    │ prove p95 < 150ms under load.      │
├───────┼───────────────────────────────┼────────────────────────────────────┤
│ 09:30 │ 8. Decision Records Summary   │ DECISION_RECORDS.md                │
│       │ Key trade-offs & future scale │ Recap top 3 ADRs; conclusion.      │
└───────┴───────────────────────────────┴────────────────────────────────────┘
```

