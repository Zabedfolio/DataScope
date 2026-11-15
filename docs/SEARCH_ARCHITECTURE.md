# DataScope Search Architecture & Query Compilation Engine

This document defines the search engine topology, query grammar, parameterized SQL compilation pipeline, index strategies, result count optimizations, and security controls for **DataScope**. It compares search architectures across scale boundaries and specifies the AST transformation rules used to query millions of enterprise records securely.

---

## Table of Contents

1. [Search Architecture Evaluation: FTS vs. Trigram vs. Elasticsearch](#1-search-architecture-evaluation-fts-vs-trigram-vs-elasticsearch)
2. [Recommended Hybrid Architecture & Migration Triggers](#2-recommended-hybrid-architecture--migration-triggers)
3. [Search Configuration Grammar & AST Schema](#3-search-configuration-grammar--ast-schema)
4. [Parameterized SQL Translation Algorithm](#4-parameterized-sql-translation-algorithm)
5. [Result Counting Strategies at Scale](#5-result-counting-strategies-at-scale)
6. [Search Caching, Highlighting & Query Auditing](#6-search-caching-highlighting--query-auditing)

---

## 1. Search Architecture Evaluation: FTS vs. Trigram vs. Elasticsearch

To evaluate the optimal search foundation for DataScope, three primary architectures were analyzed against enterprise data requirements:

| Evaluation Criteria | PostgreSQL Full-Text Search (`tsvector`) | PostgreSQL Trigram (`pg_trgm` GIN) | Elasticsearch / OpenSearch |
| :--- | :--- | :--- | :--- |
| **Partial Substring Match** | Poor (Prefix matching only; no mid-string `*acme*`) | **Exceptional** (Finds `%cme%`, `%9841%` instantly) | Good (Requires wildcard or ngram analyzers) |
| **Typo Tolerance / Fuzzy** | Moderate (Levenshtein function; slow in index) | **High** (Native similarity `%` and `<->` distance) | **Very High** (Native Lucene edit-distance scoring)|
| **Relevance Ranking** | Native `ts_rank_cd` (term frequency scoring) | Strict distance scoring (`word_similarity()`) | **Industry Gold Standard** (BM25 algorithm) |
| **Combined Structured Filtering** | Seamless (Single SQL `WHERE` with relational joins)| **Seamless** (Combined with B-tree indexes natively) | Complex (Requires dual queries or denormalization)|
| **Index Size Overhead** | Low (~10–15% of table size) | Moderate (~25–35% of table size) | High (~100–150% due to full inverted doc store) |
| **Write / Reindex Cost** | Low (Generated column trigger) | Moderate (GIN index updates take locks on batch) | High (Requires asynchronous sync pipeline CDC) |
| **Operational Complexity** | **Zero** (Native to PostgreSQL) | **Zero** (`CREATE EXTENSION pg_trgm;`) | **Very High** (Separate cluster, nodes, sharding) |
| **Infrastructure Cost** | \$0 (Shares existing database) | \$0 (Shares existing database) | \$150–\$1,200+/month for managed cluster |
| **Performance @ 100K Rows** | p95 < 25ms | **p95 < 30ms** | p95 < 20ms |
| **Performance @ 1M Rows** | p95 < 80ms | **p95 < 120ms** | p95 < 40ms |
| **Performance @ 10M Rows** | p95 < 350ms (Requires partitioning) | p95 < 600ms (High memory/IOPS required) | **p95 < 50ms** (Horizontally scaled) |

---

## 2. Recommended Hybrid Architecture & Migration Triggers

### 2.1 The Selected Approach: PostgreSQL Hybrid Strategy
For DataScope's initial release and growth through **1,000,000 records**, a native **PostgreSQL Hybrid Model** is selected:
1. **Partial / Substring Text Matches**: Accelerated by Generalized Inverted Indexes (`GIN`) using the `gin_trgm_ops` operator class from `pg_trgm`. This powers instantaneous partial matching on critical text fields (`company_name`, `email`, `domain`, `reference_code`).
2. **Global Document Search**: Powered by a generated PostgreSQL `tsvector` column (`search_document`) aggregating all textual fields with an English dictionary stemmer and a GIN index.
3. **Structured & Range Filters**: Structured attributes (`status`, `country`, `revenue`, `created_at`) are indexed using standard B-tree and composite indexes.
4. **JSONB Deep Queries**: High-frequency filterable JSONB paths are indexed via JSONB Path Expressions (`CREATE INDEX idx_records_revenue ON dataset_records USING btree (((payload->>'revenue')::numeric));`).

### 2.2 Concrete Migration Triggers (When to Adopt Elasticsearch/OpenSearch)
The PostgreSQL hybrid architecture will remain the production baseline until **any** of the following empirical operational thresholds are breached:
1. **Dataset Volume**: Total active searchable records exceed **5,000,000 rows** in a single unpartitioned table.
2. **Latency Degradation**: Production p95 query latency consistently exceeds **500ms** under normal concurrency (50 active analysts).
3. **Write Contention**: Batch record insertion rates exceed **2,000 writes/second**, creating GIN index vacuuming lock contention.
4. **Complex Full-Text Features**: Requirement for multi-language lemmatization, semantic vector search, or dynamic nested faceting that overwhelms relational SQL query plans.

---

## 3. Search Configuration Grammar & AST Schema

To guarantee defense-in-depth, the client **NEVER sends raw SQL or unrestricted database column names**. Instead, queries are expressed as a strictly typed JSON Abstract Syntax Tree (AST):

```json
{
  "datasetId": "customers_enterprise",
  "searchKeyword": "Acme",
  "conjunction": "and",
  "conditions": [
    {
      "field": "account_status",
      "operator": "eq",
      "value": "Active"
    },
    {
      "field": "country",
      "operator": "eq",
      "value": "Germany"
    },
    {
      "field": "annual_revenue",
      "operator": "gt",
      "value": 10000
    },
    {
      "field": "created_at",
      "operator": "gte",
      "value": "2026-10-14T00:00:00.000Z"
    }
  ],
  "sort": [
    { "field": "annual_revenue", "direction": "desc" },
    { "field": "id", "direction": "asc" }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25
  }
}
```

### 3.1 Operator Matrix by Field Data Type

| Data Type | Allowed Operators | Validation Rule |
| :--- | :--- | :--- |
| `text` | `eq`, `neq`, `contains`, `not_contains`, `starts_with`, `is_null`, `is_not_null` | Max length 255 chars, escaped string |
| `number` / `currency` | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, `is_null`, `is_not_null` | Valid numeric float/int, `min <= max` |
| `date` / `timestamp` | `eq`, `before`, `after`, `between`, `is_null`, `is_not_null` | ISO-8601 string or named preset |
| `enum` | `eq`, `neq`, `in`, `not_in` | Value must match allowed enum array |
| `boolean` | `eq` | Value must be strict boolean (`true`/`false`)|

### 3.2 Security Whitelisting & Guardrails
- **Field Whitelisting**: Every `field` parameter in incoming ASTs is validated against the active dataset's `DatasetFields` dictionary. Any field name not present in the catalog triggers an immediate `422 Unprocessable Entity`.
- **System Constraints**:
  - Maximum conditions per query: `20`.
  - Maximum query string length: `100` characters.
  - Maximum page size: `100` rows.
  - Maximum nested condition depth: `3` tiers.

---

## 4. Parameterized SQL Translation Algorithm

The Express backend compiles the validated JSON AST into safe, parameterized SQL. User inputs are **NEVER concatenated directly into SQL strings**, entirely eliminating SQL Injection vectors.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SQL COMPILATION PIPELINE (4 STEPS)                   │
├────────────────────────────────────────────────────────────────────────┤
│ Step 1: Initialize Query Context with Parameter Index Counter ($1)     │
│ Step 2: Inject Mandatory Security Scopes (Dataset ID & Tenant ACL)     │
│ Step 3: Recursively Compile Filter Groups into SQL Predicates          │
│ Step 4: Append Deterministic Multi-Sort Tie-Breaker & Limit/Offset     │
└────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Translation Logic:
1. **Base Statement**:
   ```sql
   SELECT id, dataset_id, created_at, updated_at, payload
   FROM dataset_records
   WHERE dataset_id = $1
   ```
2. **Dataset-Level ACL Injection**:
   The authorization middleware verifies the user's role against `access_permissions`. If the user is restricted to specific regions or data partitions, an immutable predicate is prepended:
   ```sql
   AND (payload->>'country' = ANY($2::text[]))
   ```
3. **Filter Group Translation**:
   For each condition in the AST, the operator is mapped to parameterized SQL:
   - `contains` $\rightarrow$ `(payload->>'company_name') ILIKE ('%' || $3 || '%')`
   - `eq` $\rightarrow$ `(payload->>'account_status') = $4`
   - `gt` $\rightarrow$ `((payload->>'annual_revenue')::numeric) > $5`
   - `gte` (date) $\rightarrow$ `((payload->>'created_at')::timestamptz) >= $6`
4. **Global Free-Text Search**:
   If `searchKeyword` is present, trigram similarity or `tsvector` matching is merged:
   ```sql
   AND (
     search_document @@ plainto_tsquery('english', $7)
     OR (payload->>'company_name') % $7
   )
   ```
5. **Deterministic Sort Tie-Breaker**:
   To prevent unstable pagination flipping between identical values, the primary key `id` is always appended as the final tie-breaker:
   ```sql
   ORDER BY ((payload->>'annual_revenue')::numeric) DESC, id ASC
   LIMIT $8 OFFSET $9;
   ```

---

## 5. Result Counting Strategies at Scale

Calculating an exact `COUNT(*)` over millions of rows on every keystroke forces PostgreSQL to perform expensive index or sequential scans. DataScope uses a tiered counting strategy:

```mermaid
flowchart TD
    QueryIn[Incoming Search Request] --> CheckScale{Total Dataset Size?}
    CheckScale -->|< 100,000 Rows| ExactCount[1. Exact COUNT(*) via Covering Index]
    CheckScale -->|100K - 1M Rows| CappedCount[2. Capped Count: LIMIT 10,001]
    CheckScale -->|> 1,000,000 Rows| EstimatedCount[3. Estimated Count via EXPLAIN / reltuples]

    ExactCount --> ShowExact["UI Displays: '42,150 Records'"]
    CappedCount --> ShowCapped["UI Displays: '10,000+ Records'"]
    ShowCapped --> DeepPageWarning["Display Keyset Cursor for Deep Navigation"]
    EstimatedCount --> ShowEstimate["UI Displays: '~1.4M Records'"]
```

### UI Communication of Record Counts:
- Exact: `"Showing 1–25 of 14,250 records"`
- Capped: `"Showing 1–25 of 10,000+ records"` (with a subtle tooltip: *"Count capped for high-speed performance"*).
- Estimated: `"Showing 1–25 of approximately 2.4M records"`.

---

## 6. Search Caching, Highlighting & Query Auditing

### 6.1 Cache Key Construction
Hot query results are cached in memory (RTK Query client) and optionally in Redis (backend). The cache key is deterministically generated via SHA-256:
$$\text{CacheKey} = \text{SHA256}(\text{datasetId} \parallel \text{normalizedQueryJSON} \parallel \text{datasetVersion} \parallel \text{userRole})$$
- `datasetVersion`: An incrementing integer on the `datasets` table. When records are imported or updated, `version` increments, instantly invalidating all stale cached queries for that dataset.
- Default TTL: **60 seconds** for table records; **300 seconds** for aggregate charts.

### 6.2 Highlighting Strategy: Client-Side Regex Execution
- **Decision: Client-Side Highlighting**.
- **Justification**: Generating highlighted snippets on the backend (`ts_headline`) requires extracting raw text, injecting HTML `<mark>` tags, and increases backend CPU overhead and payload size. Instead, the frontend receives clean raw strings and applies a high-performance client-side regular expression:
  ```tsx
  export function HighlightMatch({ text, query }: { text: string; query: string }) {
    if (!query) return <>{text}</>;
    const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-highlight text-foreground font-semibold px-0.5 rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  }
  ```

### 6.3 Query Auditing & Search History Logging
Every executed analytical search dispatches an asynchronous non-blocking event to the `search_history` table:
```ts
interface SearchHistoryLog {
  userId: string;
  datasetId: string;
  queryConfig: SearchConfigAST;
  executionDurationMs: number;
  resultsCount: number;
  executedAt: Date;
}
```
This data powers the user's **Search History** view and alerts system administrators to unindexed or slow queries across the enterprise.

