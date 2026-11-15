# DataScope API Architecture & RESTful Endpoint Specification

This document defines the API conventions, request/response envelope schemas, HTTP status codes, rate limiting rules, validation pipelines, and exhaustive endpoint catalogs for **DataScope**. It governs all communication between the Next.js frontend, the Express API tier, and external enterprise integrations.

---

## Table of Contents

1. [RESTful Conventions & Protocol Standards](#1-restful-conventions--protocol-standards)
2. [Standard Response Envelopes & Schemas](#2-standard-response-envelopes--schemas)
3. [Comprehensive Endpoint Catalog by Domain](#3-comprehensive-endpoint-catalog-by-domain)
4. [Request Validation Architecture (Zod Engine)](#4-request-validation-architecture-zod-engine)
5. [Bulk Export Streaming & Asynchronous Jobs](#5-bulk-export-streaming--asynchronous-jobs)
6. [OpenAPI (Swagger) Specification Strategy](#6-openapi-swagger-specification-strategy)

---

## 1. RESTful Conventions & Protocol Standards

All DataScope API endpoints strictly adhere to standardized RESTful architectural patterns:

- **URI Root & Versioning**: All business endpoints are versioned under `/api/v1/` (e.g., `/api/v1/datasets`). Better Auth endpoints reside at `/api/auth/*`.
- **Resource Naming**: Pluralized nouns, lowercase, kebab-case for multi-word paths (e.g., `/saved-views`, `/search-history`).
- **HTTP Methods**:
  - `GET`: Safe, idempotent read operations.
  - `POST`: Create new resources or execute complex query AST searches that exceed URL length limits.
  - `PUT`: Complete resource replacement.
  - `PATCH`: Partial resource mutation.
  - `DELETE`: Resource removal.
- **Request Tracing**: Every inbound request is stamped with a unique `X-Request-ID` UUID header by Express middleware, mirrored in response headers and audit logs.
- **Idempotency**: Data mutation operations accept an optional `Idempotency-Key` header to prevent duplicate creations under network retries.

---

## 2. Standard Response Envelopes & Schemas

To maintain predictable client-side consumption, all endpoints return a consistent JSON envelope.

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_8941a02b-3c80",
    "timestamp": "2026-11-13T14:20:00.000Z"
  }
}
```

### 2.2 Standard Paginated List Envelope
```json
{
  "success": true,
  "data": [
    {
      "id": "rec_00984102",
      "referenceCode": "REC-00984102",
      "payload": {
        "company_name": "Acme Corp GmbH",
        "account_status": "Active",
        "annual_revenue": 420000.00
      },
      "createdAt": "2026-10-12T08:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_8941a02b-3c80",
    "timestamp": "2026-11-13T14:20:00.000Z"
  },
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalRecords": 104230,
    "totalPages": 4170,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "ZXlKamJH... (base64)"
  }
}
```

### 2.3 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The search configuration contains invalid filter criteria.",
    "details": [
      {
        "field": "filters.conditions[0].value",
        "issue": "Expected number, received string"
      }
    ],
    "requestId": "req_8941a02b-3c80"
  }
}
```

---

## 3. Comprehensive Endpoint Catalog by Domain

### 3.1 Authentication & Session Management (Better Auth)
*Handled via `toNodeHandler(auth)` mounted at `/api/auth/*`.*

| Method | Path | Purpose | Role Required | Request Body Summary | Response Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/sign-in/email` | Email + password login | Public | `{ email, password }` | Set session cookie + user |
| `POST` | `/api/auth/sign-up/email` | New user registration | Public | `{ email, password, name }` | 201 Created + session |
| `POST` | `/api/auth/sign-out` | Terminate session | Public | None | Clear session cookie |
| `GET` | `/api/auth/get-session` | Retrieve active session| Public | None | Current user + role |
| `GET` | `/api/auth/ok` | Better Auth health check| Public | None | `{"ok": true}` |

### 3.2 Datasets & Fields Metadata

| Method | Path | Purpose | Role Required | Query / Body Params | Response Summary | Caching |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/datasets` | List accessible datasets | Viewer+ | `?search=cust` | Array of `Dataset` entities | 5 min |
| `GET` | `/api/v1/datasets/:id` | Get dataset details | Viewer+ | None | Single `Dataset` with record count | 5 min |
| `POST` | `/api/v1/datasets` | Register new dataset | Admin | `{ name, slug, description }` | 201 Created `Dataset` | None |
| `GET` | `/api/v1/datasets/:id/fields` | List schema fields | Viewer+ | None | Array of `DatasetField` | 10 min |
| `POST` | `/api/v1/datasets/:id/fields` | Add field to schema | Admin | `{ name, key, dataType }` | 201 Created `DatasetField` | Inval |

### 3.3 Dataset Records (The Centerpiece Explorer)

| Method | Path | Purpose | Role Required | Query / Body Params | Response Summary | Caching |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/datasets/:id/records` | Query & filter records | Viewer+ | `?q=&filters=&sort=&page=&pageSize=&cols=` | Paginated records envelope | 60s |
| `POST` | `/api/v1/datasets/:id/records/search`| Complex AST search | Viewer+ | Body: `SearchConfigAST` | Paginated records envelope | 60s |
| `GET` | `/api/v1/datasets/:id/records/:recordId`| Get record details | Viewer+ | None | Full record + all JSONB attrs | 3 min |
| `GET` | `/api/v1/datasets/:id/records/:recordId/history`| Audit timeline | Analyst+ | None | Array of audit diff entries | 3 min |
| `GET` | `/api/v1/datasets/:id/records/:recordId/relationships`| Related records | Viewer+ | None | Array of associated records | 3 min |
| `PATCH`| `/api/v1/datasets/:id/records/:recordId`| Mutate record fields | Analyst+ | `{ payload: { revenue: ... } }` | 200 OK + updated record | Inval |

### 3.4 Saved Views & Personalization

| Method | Path | Purpose | Role Required | Query / Body Params | Response Summary | Caching |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/saved-views` | List views for dataset | Viewer+ | `?datasetId=cust_1` | Array of `SavedView` | 2 min |
| `POST` | `/api/v1/saved-views` | Create saved view | Viewer+ | `{ name, datasetId, configuration, isShared }` | 201 Created view | Inval |
| `PUT` | `/api/v1/saved-views/:id` | Update saved view | Owner/Admin | `{ name, configuration, isShared }` | 200 OK updated view | Inval |
| `DELETE`| `/api/v1/saved-views/:id`| Remove saved view | Owner/Admin | None | 204 No Content | Inval |

### 3.5 Search History & Analytics

| Method | Path | Purpose | Role Required | Query / Body Params | Response Summary | Caching |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/search/history` | List recent queries | Viewer+ | `?limit=50` | Array of executed queries | 60s |
| `GET` | `/api/v1/analytics/overview` | Dashboard summary vitals | Viewer+ | None | Total records, active datasets | 2 min |
| `POST` | `/api/v1/analytics/aggregate`| Dynamic aggregations | Analyst+ | `{ datasetId, groupBy, metric, filters }` | Aggregate bucket series | 5 min |

### 3.6 User Preferences & Admin

| Method | Path | Purpose | Role Required | Query / Body Params | Response Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/preferences` | Get user UI config | Viewer+ | None | Theme, density, sidebar |
| `PATCH`| `/api/v1/preferences` | Update UI config | Viewer+ | `{ theme, tableDensity }` | Updated preference object |
| `GET` | `/api/v1/admin/users` | List platform users | Admin ONLY | `?page=1&search=john` | Paginated user accounts + roles |
| `PATCH`| `/api/v1/admin/users/:id/role`| Update user role | Admin ONLY | `{ role: 'Data Analyst' }` | Updated user record |
| `GET` | `/api/health` | Service health check | Public | None | `{"status": "ok"}` |

---

## 4. Request Validation Architecture (Zod Engine)

Every incoming HTTP request undergoes rigorous schema validation using **Zod** before hitting controllers or database adapters:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      REQUEST VALIDATION PIPELINE                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Express Router receives request                                     │
│ 2. validateRequest(schema) middleware inspects req.query / req.body    │
│ 3. If invalid -> Formats ZodError into 422 JSON envelope immediately   │
│ 4. If valid   -> Attaches validated data to req.validated and proceeds │
└────────────────────────────────────────────────────────────────────────┘
```

```ts
// Example Express Validation Middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "Request validation failed.",
          details: result.error.errors.map((e) => ({
            field: e.path.join("."),
            issue: e.message,
          })),
        },
      });
    }
    req.validated = result.data;
    next();
  };
};
```

---

## 5. Bulk Export Streaming & Asynchronous Jobs

Exporting records is segregated into two execution modes to prevent socket exhaustion:

### 5.1 Synchronous Streaming Export ($\le 10,000$ Rows)
- **Path**: `GET /api/v1/datasets/:id/export?format=csv&filters=...`
- **Behavior**: Express streams chunked CSV data directly to the HTTP response using Node.js Transform streams:
  ```ts
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="export_${datasetId}.csv"`);
  // Node.js stream pipeline piping database cursor to res
  ```

### 5.2 Asynchronous Background Export ($> 10,000$ Rows)
- **Path**: `POST /api/v1/exports/jobs`
- **Behavior**:
  1. Enqueues a background job in BullMQ / Redis.
  2. Returns `202 Accepted` with a `jobId`.
  3. Worker streams 100K+ records into cloud storage (S3 / R2).
  4. Client polls `GET /api/v1/exports/jobs/:jobId` until `status: "completed"`, downloading via a signed one-time download URL.

---

## 6. OpenAPI (Swagger) Specification Strategy

The entire API contract is maintained via an automated OpenAPI 3.1 specification:
- **Generation**: Schemas in `zod` are automatically exported to OpenAPI JSON using `@asteasolutions/zod-to-openapi`.
- **Documentation Route**: In non-production environments, `/api/docs` serves a self-hosted Swagger UI interface for interactive API exploration and automated contract testing.

