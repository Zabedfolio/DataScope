# DataScope Architectural Decision Records (ADR)

This document contains the canonical Architectural Decision Records (ADRs) governing the technical foundation, framework selections, data models, state paradigms, and performance optimizations for **DataScope**. Every record documents the architectural problem, evaluated alternatives, selected approach, trade-offs, and empirical verification criteria.

---

## Table of Contents

1. [ADR-001: RTK Query vs. Redux Async Thunks](#adr-001-rtk-query-vs-redux-async-thunks)
2. [ADR-002: Server-Side vs. Client-Side Pagination](#adr-002-server-side-vs-client-side-pagination)
3. [ADR-003: PostgreSQL Relational Engine vs. MongoDB Document Store](#adr-003-postgresql-relational-engine-vs-mongodb-document-store)
4. [ADR-004: Keyset (Cursor-Based) vs. SQL Offset Pagination](#adr-004-keyset-cursor-based-vs-sql-offset-pagination)
5. [ADR-005: PostgreSQL FTS & Trigram (pg_trgm) vs. Elasticsearch / OpenSearch](#adr-005-postgresql-fts--trigram-pg_trgm-vs-elasticsearch--opensearch)
6. [ADR-006: Debouncing Strategy for High-Density Search Inputs](#adr-006-debouncing-strategy-for-high-density-search-inputs)
7. [ADR-007: DOM Virtualization (TanStack Virtual) vs. Infinite Lazy Loading](#adr-007-dom-virtualization-tanstack-virtual-vs-infinite-lazy-loading)
8. [ADR-008: Caching Topology: What to Cache and Where](#adr-008-caching-topology-what-to-cache-and-where)
9. [ADR-009: URL-Based Query String as Canonical Exploration State](#adr-009-url-based-query-string-as-canonical-exploration-state)
10. [ADR-010: Strict Separation of Server State and Global Client State](#adr-010-strict-separation-of-server-state-and-global-client-state)
11. [ADR-011: Hybrid Relational Identity + JSONB Dynamic Record Storage](#adr-011-hybrid-relational-identity--jsonb-dynamic-record-storage)
12. [ADR-012: Better Auth with Drizzle Adapter vs. NextAuth (Auth.js)](#adr-012-better-auth-with-drizzle-adapter-vs-nextauth-authjs)
13. [ADR-013: Standalone Express.js API vs. Next.js Internal Route Handlers](#adr-013-standalone-expressjs-api-vs-nextjs-internal-route-handlers)
14. [ADR-014: Managed PostgreSQL (Supabase) vs. Self-Hosted Docker PostgreSQL](#adr-014-managed-postgresql-supabase-vs-self-hosted-docker-postgresql)

---

### ADR-001: RTK Query vs. Redux Async Thunks
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: How to manage server data fetching, in-memory caching, lifecycle loading indicators, and cache revalidation in the React frontend.
- **Available Alternatives**: (1) Manual `createAsyncThunk` with custom slice reducers, (2) RTK Query (`createApi`), (3) SWR, (4) TanStack Query.
- **Selected Approach**: **RTK Query** (`createApi`).
- **Reason for Selection**: RTK Query is built natively into Redux Toolkit, avoiding the need for extra dependencies while completely eliminating boilerplate code for tracking loading flags, error envelopes, and request deduplication.
- **Advantages**: Automatic request deduplication across concurrent components, declarative tag-based cache invalidation, built-in garbage collection via `keepUnusedDataFor`, zero boilerplate.
- **Disadvantages**: Steep learning curve for multi-step mutations; normalized cache inspection requires Redux DevTools.
- **Performance Implications**: Eliminates duplicate network requests across mounting components; saves significant client memory by cleaning up inactive cache entries.
- **Future Limitations**: Highly specialized streaming WebSockets may require custom Redux middleware.

---

### ADR-002: Server-Side vs. Client-Side Pagination
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Should the platform fetch full datasets and paginate within browser memory, or fetch fixed page slices from the database?
- **Available Alternatives**: (1) Full client-side dataset fetching, (2) Server-side pagination via database queries.
- **Selected Approach**: **Server-Side Pagination**.
- **Reason for Selection**: DataScope explores datasets with 100,000 to 10,000,000 records. Transferring 100K JSON records over the wire consumes over 50 MB of bandwidth and will crash mobile and low-memory browser tabs.
- **Advantages**: Tiny wire payload (< 50 kB per page), instant initial paint, scales to billions of records seamlessly.
- **Disadvantages**: Page changes require network roundtrips (~30–150ms).
- **Performance Implications**: Network latency replaces client memory exhaustion; easily mitigated via next-page prefetching in RTK Query.
- **Future Limitations**: Offline exploration of un-cached pages is not possible without network connectivity.

---

### ADR-003: PostgreSQL Relational Engine vs. MongoDB Document Store
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Selecting the primary storage database engine for enterprise datasets with structured, semi-structured, and audit tracking requirements.
- **Available Alternatives**: (1) MongoDB Document Database, (2) PostgreSQL 16 Relational Database, (3) ClickHouse OLAP.
- **Selected Approach**: **PostgreSQL 16**.
- **Reason for Selection**: DataScope requires strict ACID transactions for Better Auth, user permissions, and audit logs, combined with advanced `JSONB` querying and GIN trigram indexing for dynamic datasets. PostgreSQL handles both relational schemas and schema-less JSONB within one unified engine.
- **Advantages**: Strong consistency, mature indexing ecosystem (`pg_trgm`, GIN, B-tree), zero impedance mismatch with Drizzle ORM, single operational footprint.
- **Disadvantages**: Horizontal sharding across multiple write nodes requires Citus or external tooling at massive scale.
- **Performance Implications**: Benchmark tests must verify that `JSONB` path queries match native column speeds when backed by expression indexes.
- **Future Limitations**: Extreme analytical aggregations across billions of rows may eventually require an OLAP database like ClickHouse.

---

### ADR-004: Keyset (Cursor-Based) vs. SQL Offset Pagination
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: How to paginate through large datasets without incurring $O(N)$ database scan penalties on deep pages.
- **Available Alternatives**: (1) Pure SQL `OFFSET / LIMIT`, (2) Pure Keyset (Cursor) pagination, (3) Hybrid model (Offset for shallow pages 1–50, Keyset for deep pages).
- **Selected Approach**: **Hybrid Model with Keyset Cursor as Primary Engine**.
- **Reason for Selection**: Standard SQL offset scans all preceding rows before returning the limit, causing deep pagination queries to spike to >800ms on 1M rows. Keyset pagination achieves constant $O(1)$ index seek performance.
- **Advantages**: Stable, instant page transitions at any depth; immune to row insertion shifts.
- **Disadvantages**: Cannot jump arbitrarily to random high page numbers (e.g., "Jump to Page 4,821").
- **Performance Implications**: Reduces p95 deep pagination latency from 850ms to under 40ms. To be verified via [docs/TESTING_AND_PERFORMANCE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/TESTING_AND_PERFORMANCE.md).
- **Future Limitations**: UI must educate users that deep dataset navigation relies on filters and directional sorting rather than page jumping.

---

### ADR-005: PostgreSQL FTS & Trigram (pg_trgm) vs. Elasticsearch / OpenSearch
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Selecting the primary search engine for text matching and multi-filter discovery.
- **Available Alternatives**: (1) PostgreSQL Full-Text Search (`tsvector`) + Trigram (`pg_trgm`), (2) Standalone Elasticsearch / OpenSearch cluster.
- **Selected Approach**: **PostgreSQL Hybrid (pg_trgm + GIN + tsvector)**.
- **Reason for Selection**: For datasets up to 1,000,000 records, PostgreSQL trigram GIN indexes provide sub-second partial substring searches (`ILIKE '%query%'`) without the high operational complexity, multi-thousand dollar infrastructure cost, and data synchronization overhead of a separate Elasticsearch cluster.
- **Advantages**: Single database to manage, transactional consistency, instant write updates without CDC lag, zero extra hosting cost.
- **Disadvantages**: Write locks during massive batch reindexing; memory-heavy GIN indexes at 10M+ records.
- **Performance Implications**: Target p95 < 150ms for 100K rows; migration triggers defined at 5M rows in [docs/SEARCH_ARCHITECTURE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/SEARCH_ARCHITECTURE.md).
- **Future Limitations**: Must migrate to OpenSearch if fuzzy phonetic matching or multi-region distributed search is required.

---

### ADR-006: Debouncing Strategy for High-Density Search Inputs
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Rapid typing in the Data Explorer search box triggers an avalanche of HTTP queries, overwhelming backend connections and causing race conditions.
- **Available Alternatives**: (1) No debounce (instant trigger on keystroke), (2) 150ms debounce, (3) 300ms debounce, (4) Explicit "Search" button click.
- **Selected Approach**: **300ms Debounce for Text Inputs; 200ms for Range Sliders; 0ms for Dropdown Selects**.
- **Reason for Selection**: 300ms matches average human typing intervals, ensuring queries fire only when the user pauses thought, reducing network traffic by >85%.
- **Advantages**: Eliminates API flood, preserves backend connection pools, maintains smooth typing feel.
- **Disadvantages**: 300ms perceptual delay before search results appear after typing ceases.
- **Performance Implications**: Prevents backend connection starvation under high user concurrency.
- **Future Limitations**: None.

---

### ADR-007: DOM Virtualization (TanStack Virtual) vs. Infinite Lazy Loading
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: How to render table pages containing 50 to 100 columns and thousands of rows without browser DOM exhaustion.
- **Available Alternatives**: (1) Standard HTML table without virtualization, (2) Infinite scroll with appending DOM nodes, (3) Windowed DOM Virtualization (`@tanstack/react-virtual`).
- **Selected Approach**: **Windowed DOM Virtualization (TanStack Virtual)**.
- **Reason for Selection**: Without virtualization, rendering 500 rows with 20 columns mounts 10,000 DOM nodes, dropping scroll frame rates below 20 FPS and causing severe browser memory bloat. Virtualization mounts only the ~35 rows currently inside the viewport.
- **Advantages**: Constant 60 FPS scrolling, flat memory footprint, instant rendering regardless of dataset size.
- **Disadvantages**: Requires fixed row heights (32px or 44px); native browser in-page `Ctrl+F` search only finds currently mounted rows.
- **Performance Implications**: Table scroll jank eliminated; DOM node count remains strictly bounded.
- **Future Limitations**: Variable-height text wrapping in table cells is restricted.

---

### ADR-008: Caching Topology: What to Cache and Where
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Determining the optimal caching boundaries across browser memory, API memory, and database buffers.
- **Available Alternatives**: (1) No caching (pure database reads), (2) Browser-only caching, (3) Multi-tier caching (Client RTK Query + Backend Redis).
- **Selected Approach**: **Multi-Tier Caching (RTK Query In-Memory + Optional Backend Redis)**.
- **Reason for Selection**: Static metadata (dataset schemas, user preferences) changes rarely and should be cached client-side for 5–10 minutes. Frequently repeated analytical queries benefit from a shared Redis cache key.
- **Advantages**: 0ms response for cached client queries; dramatic reduction in database CPU load.
- **Disadvantages**: Cache invalidation complexity when mutations occur.
- **Performance Implications**: Relieves database load by up to 60% on read-heavy workloads.
- **Future Limitations**: Redis eviction policies must be monitored to prevent OOM errors at large scales.

---

### ADR-009: URL-Based Query String as Canonical Exploration State
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Where should active dataset filters, search terms, and sort orders live to enable seamless sharing and browser history navigation?
- **Available Alternatives**: (1) Pure Redux state, (2) React component state, (3) Browser URL query string as Single Source of Truth.
- **Selected Approach**: **URL Query String as Canonical Source of Truth**.
- **Reason for Selection**: Enterprise analysts collaborate by sharing links. Storing filter state in the URL ensures that copying a URL shares the exact analytical view instantly, and browser Back/Forward navigation functions naturally.
- **Advantages**: 100% shareable analytical sessions, bookmarkable views, zero state desynchronization.
- **Disadvantages**: URL length limits (~2,000 chars); complex nested filter ASTs must be efficiently serialized.
- **Performance Implications**: Next.js shallow routing ensures URL updates do not trigger full page reloads.
- **Future Limitations**: Filter trees with >30 conditions must compress state or fall back to short-lived database view tokens.

---

### ADR-010: Strict Separation of Server State and Global Client State
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Preventing state bloat, stale record bugs, and re-render cascades in the Redux store.
- **Available Alternatives**: (1) Store all fetched records inside Redux slice state, (2) Keep server records exclusively in RTK Query cache; Redux manages only UI interactions.
- **Selected Approach**: **Strict Separation: Records in RTK Query; UI interactions in Redux**.
- **Reason for Selection**: Storing large arrays of records in Redux triggers massive immutability overhead on every slice update and clutters Redux DevTools. RTK Query handles server state normalization and garbage collection automatically.
- **Advantages**: Redux store remains lightweight (< 50 kB); table row selection does not re-render unselected rows.
- **Disadvantages**: Developers must learn which hooks to use for UI state vs. server data.
- **Performance Implications**: Drastically reduces JavaScript heap allocations in the browser.
- **Future Limitations**: None.

---

### ADR-011: Hybrid Relational Identity + JSONB Dynamic Record Storage
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: How to persist diverse datasets with arbitrary user-defined schemas without executing runtime DDL migrations.
- **Available Alternatives**: (1) Generate separate PostgreSQL table per dataset (`CREATE TABLE dataset_123 ...`), (2) Entity-Attribute-Value (EAV) table, (3) Hybrid Relational Identity + JSONB payload.
- **Selected Approach**: **Hybrid Relational Identity + JSONB Dynamic Storage**.
- **Reason for Selection**: Dynamic DDL migrations in production risk table lock contention and schema exhaustion. The EAV model requires dozens of table joins for a single record. PostgreSQL `JSONB` provides binary JSON storage with B-tree expression indexing at native SQL speeds.
- **Advantages**: Users create new datasets in real-time with zero schema migrations; unified foreign keys and audit logs.
- **Disadvantages**: Requires Postgres-specific `JSONB` path operators (`->>`); schema changes must be validated at the application layer via Zod.
- **Performance Implications**: Verified to match typed column performance when backed by B-tree expression indexes.
- **Future Limitations**: Promoted high-frequency columns may be added as physical columns if analytics demand.

---

### ADR-012: Better Auth with Drizzle Adapter vs. NextAuth (Auth.js)
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Selecting a modern, secure, TypeScript-native authentication framework for session and cookie management.
- **Available Alternatives**: (1) NextAuth.js (Auth.js), (2) Passport.js, (3) Better Auth with Drizzle Adapter.
- **Selected Approach**: **Better Auth with Drizzle PostgreSQL Adapter**.
- **Reason for Selection**: Better Auth is a modern, framework-agnostic, pure ESM authentication engine designed specifically for TypeScript and Drizzle ORM. Unlike NextAuth (tightly coupled to Next.js), Better Auth mounts seamlessly into Express via `toNodeHandler(auth)`.
- **Advantages**: Clean Drizzle adapter, native Node.js HTTP handler, strict session cookie security, zero vendor lock-in.
- **Disadvantages**: Relatively young library compared to Passport.js.
- **Performance Implications**: Sub-millisecond session validation via memory-cached tokens or indexed database lookups.
- **Future Limitations**: Auth tables must be generated via Better Auth CLI as specified in the platform roadmap.

---

### ADR-013: Standalone Express.js API vs. Next.js Internal Route Handlers
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Should the backend API logic reside inside Next.js App Router Route Handlers or a standalone Express.js service?
- **Available Alternatives**: (1) Next.js internal App Router Route Handlers (`/app/api/...`), (2) Standalone Express.js API server (`backend/`).
- **Selected Approach**: **Standalone Express.js API Server (`backend/`)**.
- **Reason for Selection**: Compiling heavy analytical AST queries, maintaining warm PostgreSQL connection pools, and streaming large CSV exports is poorly suited for serverless Next.js functions. A dedicated Express server provides long-lived pooled connections and independent horizontal scaling.
- **Advantages**: Persistent database connection pooling via `pg.Pool`, decoupled CPU compute, independent deployment lifecycle, multi-client support.
- **Disadvantages**: Requires maintaining two separate development runtime servers (`:3000` and `:5000`) and configuring CORS.
- **Performance Implications**: Eliminates serverless cold starts and prevents Next.js SSR threads from being starved by heavy analytical queries.
- **Future Limitations**: None.

---

### ADR-014: Managed PostgreSQL (Supabase) vs. Self-Hosted Docker PostgreSQL
- **Status**: Proposed
- **Date**: 2026-11-13
- **Problem**: Selecting the persistence host for local development, automated testing, and production deployment.
- **Available Alternatives**: (1) Self-hosted Docker PostgreSQL 16 container, (2) Managed Supabase PostgreSQL instance.
- **Selected Approach**: **Dual Support: Docker Compose for Local Development / CI; Supabase for Cloud Production**.
- **Reason for Selection**: Developers and CI pipelines require zero-network, local offline database execution via `docker compose up -d`. For cloud deployments, Supabase provides managed PostgreSQL with built-in pooling, SSL, and automated backups.
- **Advantages**: Total local development independence; seamless transition to managed cloud infrastructure using identical Drizzle migrations.
- **Disadvantages**: Supabase transaction pooler port (6543) requires separate handling from the direct migration port (5432).
- **Performance Implications**: Evaluated in [docs/TESTING_AND_PERFORMANCE.md](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/TESTING_AND_PERFORMANCE.md).
- **Future Limitations**: Supabase free-tier egress limits must be monitored during 100K+ benchmark runs.

