# DataScope Autonomous Agent & Developer Governance Rules

This document establishes the mandatory operational rules, structural boundaries, and security constraints for any autonomous AI agent or software engineer operating within the **DataScope** repository. These rules are non-negotiable and override default boilerplate instincts.

---

## Table of Contents

1. [Architectural Primacy & Pre-Flight Checklist](#1-architectural-primacy--pre-flight-checklist)
2. [Ten Immutable Engineering Laws](#2-ten-immutable-engineering-laws)
3. [Design Token & Styling Constraints](#3-design-token--styling-constraints)
4. [Security & Query Guardrails](#4-security--query-guardrails)
5. [Testing & Quality Verification Contract](#5-testing--quality-verification-contract)

---

## 1. Architectural Primacy & Pre-Flight Checklist

Before generating or modifying any code within `frontend/`, `backend/`, or `docs/`:

1. **Mandatory Documentation Inspection**:
   - You MUST read the relevant specification in `docs/` and [`SKILL.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/SKILL.md) before writing code.
2. **Surface Boundary Verification**:
   - Identify whether the task touches a **Public Marketing Surface** (where [`SKILL.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/SKILL.md) allows restrained immersive motion) or an **Authenticated Application Surface** (where decorative motion and smooth scrolling are strictly forbidden).
3. **No Unapproved Dependencies**:
   - Do NOT install or add npm dependencies that are not explicitly documented in [`docs/DECISION_RECORDS.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DECISION_RECORDS.md). If a new library is required, draft an ADR first.

---

## 2. Ten Immutable Engineering Laws

```
┌────────────────────────────────────────────────────────────────────────┐
│                      THE TEN IMMUTABLE LAWS OF DATASCOPE               │
├─────┬──────────────────────────────────────────────────────────────────┤
│ I   │ NEVER stream or buffer entire datasets into frontend memory.    │
│ II  │ NEVER store large arrays of records in the Redux store.         │
│ III │ NEVER accept raw SQL or un-whitelisted column names from client. │
│ IV  │ EVERY list endpoint MUST be paginated and permission-checked.    │
│ V   │ NEVER invent colors or tokens ad hoc; use Petrol & Saffron.      │
│ VI  │ NO decorative motion, smooth-scroll, or custom cursors in app.  │
│ VII │ NO zebra striping in tabular grids; use crisp micro-borders.    │
│ VIII│ ALL numbers in tables MUST use tabular numerals (tabular-nums).  │
│ IX  │ EVERY feature MUST have corresponding automated unit/API tests. │
│ X   │ KEEP documentation in sync whenever technical decisions evolve. │
└─────┴──────────────────────────────────────────────────────────────────┘
```

---

## 3. Design Token & Styling Constraints

1. **Token Authority**:
   - All colors must reference CSS variables defined in [`docs/DESIGN_ARCHITECTURE.md`](file:///Users/zabedmahmud/Documents/Projects/DataScope/docs/DESIGN_ARCHITECTURE.md) (`--background`, `--surface`, `--sidebar`, `--border`, `--foreground`, `--primary`, `--secondary`, `--highlight`).
   - Never inject hardcoded hex values into components.
2. **Saffron Contrast Safety**:
   - Saffron (`--primary`) must NEVER be used for small body text on light backgrounds. Buttons with saffron backgrounds must render text in dark ink slate (`#10242B`) with `font-semibold`.
3. **Typography**:
   - Headings use `Bricolage Grotesque` or `Geist Sans`.
   - Data cells, primary keys, currency, and numbers must use `Geist Mono` or `JetBrains Mono` with `tabular-nums`.

---

## 4. Security & Query Guardrails

1. **100% Parameterized SQL**:
   - Never concatenate user input into database queries. All filters, search terms, and IDs must be passed as parameterized positional variables (`$1, $2, ...`).
2. **Mandatory Tenant & Dataset Isolation**:
   - Every record query must contain `WHERE dataset_id = $1` as an immutable clause injected by server-side authorization middleware.
3. **Defense-in-Depth**:
   - Never rely on the frontend for security. Hiding a button in React does not secure an endpoint. All RBAC checks must be executed authoritatively in the Express API.

---

## 5. Testing & Quality Verification Contract

1. **Test-Driven Delivery**:
   - When creating an endpoint or feature component, write corresponding Vitest / Supertest tests in the same turn.
2. **Zero Hallucinated Metrics**:
   - Never claim a query runs in "10ms" or "scales effortlessly" without providing real `EXPLAIN (ANALYZE, BUFFERS)` or `k6` benchmark output.
3. **CI Cleanliness**:
   - Ensure `npm run build`, `npm run lint`, and `npm test` pass cleanly with zero warnings or errors.

