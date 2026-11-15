# DataScope — Enterprise Data Discovery & Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1_App_Router-black.svg)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2-green.svg)](https://fastify.dev/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.38-yellow.svg)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase_Dual_Pooler-336791.svg)](https://supabase.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC.svg)](https://redux-toolkit.js.org/)
[![Tests](https://img.shields.io/badge/Tests-19%20Passing%20(Vitest)-brightgreen.svg)](https://vitest.dev/)

> **Level 1 Assessment Deliverable (60 Marks)**: Data-Intensive Full-Stack Engineering Platform managing **100,000+ records** with sub-20ms indexed search, normalized RTK Query data-fetching, visual AST query composition, and flat-memory streaming exports.

---

## 1. Project Overview & Business Problem

Enterprises maintaining millions of records across multi-cluster Kubernetes telemetry, high-frequency financial limit order books, and cross-border settlement ledgers struggle with:
- Heavy memory bloat and frame drops when loading large datasets into browser memory.
- Unnecessary duplicate API requests and slow un-indexed database sequential scans.
- Desynchronized state between URL parameters, global store, and deep multi-predicate search filters.

**DataScope** solves these challenges through a centralized, workstation-grade data platform combining **server-side indexed query optimization**, **RTK Query normalized caching**, **multi-column sorting**, **visual AST query trees**, and **flat-memory streaming export pipelines**.

---

## 2. Key Features

- **High-Throughput Data Explorer**: Table view over 100,004 live records supporting server-side pagination, multi-column sorting (`Shift + Click`), column visibility customization, and view density switching.
- **Visual AST Query Builder**: Compose nested Boolean expressions (`AND`/`OR`) with real-time SQL output and CLI command compilation without writing raw SQL.
- **Real-Time Cluster Throughput Dynamics**: 750ms live sampling engine generating smooth cubic Bezier waveform splines across cluster telemetry channels (`All`, `US-East`, `US-West`, `EU-Vault`).
- **In-Engine Analytics Dashboard**: SQL aggregation queries computing Growth Velocity (AreaChart), Microservice Ingestion Volumes (BarChart), and HTTP Status Code Distributions (Donut Chart with semantic color mapping).
- **Search History & Saved Views**: Persistent user-saved query presets with team-sharing permissions and 1-click historical search retrieval.
- **Flat-Memory CSV Streaming Engine**: Streams up to 50,000 records row-by-row with constant 14MB memory consumption, eliminating Out-Of-Memory crashes.
- **Enterprise RBAC**: 3 verified security roles (`Administrator`, `Data Analyst`, `Viewer`) with granular operational permission gates.

---

## 3. System Architecture & Diagrams

### A. Frontend Architecture

```mermaid
graph TD
    User["Analyst Browser Viewport"] --> WS["Dedicated Workstation Shell (/dashboard/*)"]
    WS --> SB["Collapsible Sidebar Navigation"]
    WS --> TB["Workstation TopBar (Breadcrumbs & Telemetry)"]
    WS --> Content["Workstation Canvas"]
    
    Content --> EXP["Data Explorer (/dashboard/explorer)"]
    Content --> ANA["Cluster Analytics (/dashboard/analytics)"]
    Content --> AST["Visual Query Builder (/dashboard/search)"]
    Content --> VIEWS["Saved Views (/dashboard/views)"]
    
    EXP --> RTKQ["RTK Query (datasetsApi)"]
    ANA --> RTKQ
    AST --> REDUX["Redux Toolkit Store"]
    
    REDUX --> S1["authSlice (RBAC)"]
    REDUX --> S2["datasetSlice"]
    REDUX --> S3["searchSlice (Debounce & Multi-Sort)"]
    REDUX --> S4["savedViewsSlice"]
    REDUX --> S5["uiPreferenceSlice"]
```

### B. Data Fetching & Caching Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as Analyst (Browser)
    participant UI as DataGrid Component
    participant RTK as RTK Query Cache
    participant API as Fastify Backend REST Service
    participant DB as Supabase PostgreSQL (100k Records)

    Analyst->>UI: Type search query (e.g. 'storage-node')
    Note over UI: 300ms Debounce Window
    UI->>RTK: Dispatch getRecords(query)
    
    alt Cache Hit (Within 60s TTL)
        RTK-->>UI: Return normalized records (< 1ms)
    else Cache Miss
        RTK->>API: GET /api/v1/records?page=1&search=...
        API->>DB: SELECT * ... ORDER BY ... LIMIT 25 OFFSET 0
        Note over DB: B-Tree Index Scan (14ms)
        DB-->>API: 25 Rows + total count (100,004)
        API-->>RTK: 200 OK + scanTimeMs (16ms)
        RTK->>RTK: Cache key hashed & stored
        RTK-->>UI: Render updated DataGrid
    end
```

### C. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    DATASETS ||--o{ RECORDS : contains
    DATASETS ||--o{ SAVED_VIEWS : targets
    USERS ||--o{ SAVED_VIEWS : authors
    USERS ||--o{ SEARCH_HISTORY : executes
    USERS ||--o{ SESSIONS : authenticates

    DATASETS {
        uuid id PK
        varchar slug UK
        varchar name
        text description
        varchar category
        varchar cluster
        bigint record_count
        timestamp created_at
    }

    RECORDS {
        uuid id PK
        uuid dataset_id FK
        timestamp timestamp
        varchar service
        varchar cluster
        varchar method
        float latency
        integer status
        numeric revenue
        varchar country
        text summary
        jsonb payload
    }

    SAVED_VIEWS {
        uuid id PK
        uuid dataset_id FK
        varchar name
        jsonb filters
        jsonb sort_config
        boolean is_shared
        timestamp created_at
    }

    SEARCH_HISTORY {
        uuid id PK
        varchar query_text
        integer result_count
        float execution_duration_ms
        timestamp created_at
    }

    USERS {
        text id PK
        text name
        text email UK
        text role
        timestamp created_at
    }
```

---

## 4. Technology Stack

| Layer | Technologies Selected | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15.1 (App Router) + React 19** | Zero-CLS streaming SSR, server components, layout subtrees. |
| **Global State** | **Redux Toolkit 2.5 (5 Core Slices)** | Predictable immutable state for cross-cutting client preferences. |
| **Data Fetching Layer** | **RTK Query** | Automated deduplication, cache key hashing, 60s TTL garbage collection. |
| **Styling & Theme** | **Tailwind CSS 3.4** | Obsidian dark mode (`#040C0E`), mint accents (`#00D69A`), theme switcher. |
| **Data Visualization** | **Recharts 3.10** | SVG charts with responsive layout, custom tooltips, and live splines. |
| **Backend Runtime** | **Fastify 5.2 (Node.js)** | 35k req/sec throughput, low event loop latency, streaming pipeline. |
| **Database ORM** | **Drizzle ORM 0.38 + postgres.js** | Zero runtime engine overhead; 11,900 inserts/sec bulk seeding. |
| **Database Engine** | **Supabase Managed PostgreSQL** | Dual-pooler (port 6543 for queries, port 5432 for DDL migrations). |
| **Testing** | **Vitest 2.1 + Testing Library** | Sandboxed unit and integration test runner (19/19 passing). |

---

## 5. Performance Benchmarks Summary

Full empirical results are documented in [`docs/PERFORMANCE_REPORT.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/PERFORMANCE_REPORT.md):

| Metric | Unindexed Baseline | DataScope Indexed Engine | Improvement |
| :--- | :---: | :---: | :---: |
| **Filtered Search (100k records)** | 340.2ms | **18.4ms** | **18.5x Faster** |
| **Page 1 Ingestion Fetch** | 185.0ms | **14.2ms** | **13.0x Faster** |
| **P99 Query Latency** | 420.0ms | **38.0ms** | **11.0x Faster** |
| **50,000-Row CSV Export Memory** | 165MB (Heap Spike) | **14MB (Flat Stream)** | **91.5% Less Memory** |
| **Client Heap Footprint** | ~180MB | **~12MB (Fixed Window)** | **Zero Browser Lag** |

---

## 6. Project Documentation & Deliverables

- 📄 **[Technical Decision Records (8 TDRs)](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/TECHNICAL_DECISIONS.md)**: Architectural defense for all 8 major technology choices.
- 📄 **[Data Fetching Architecture & 10 Questions](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DATA_FETCHING_ARCHITECTURE.md)**: Detailed answers to all assessment questions from §4 and §19.
- 📄 **[Performance Evaluation Report](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/PERFORMANCE_REPORT.md)**: Measurable latency, indexing, and memory benchmarks on 100,004 records.
- 📄 **[Video Presentation Speaker Script](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/PRESENTATION_SCRIPT.md)**: Slide-by-slide presenter notes covering all requirements from §19.

---

## 7. Setup & Running Instructions

### Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### 1. Clone & Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables
```bash
# Backend (.env)
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?prepare=false"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
PORT=4000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Seed 100,000+ Records
```bash
cd backend
npx tsx src/db/seed-100k.ts
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend Server
cd backend
npm run dev

# Terminal 2: Frontend Next.js Client
cd frontend
npm run dev
```

Visit **`http://localhost:3000`** (Landing page) or **`http://localhost:3000/dashboard`** (Enterprise Workstation).

### 5. Run Automated Tests
```bash
cd frontend
npm run test
```
