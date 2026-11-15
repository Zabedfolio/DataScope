export interface DatasetMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  recordCount: number;
  byteSizeFormatted: string;
  cluster: string;
  throughputRate: string;
  syncFrequency: string;
  tags: string[];
  accessLevel?: "Public" | "Enterprise" | "Restricted";
}

export interface StreamRecord {
  id: string;
  timestamp: string;
  cluster: string;
  service: string;
  method: "POST" | "GET" | "STREAM" | "BATCH" | "DELETE" | "PUT";
  latency: number; // ms
  status: 200 | 201 | 400 | 401 | 403 | 404 | 429 | 500 | 502 | 503;
  summary: string;
  payload: Record<string, unknown>;
  rawHex: string;
  tags: string[];
}

export type ViewDensity = "compact" | "comfortable";

export type SortField = "timestamp" | "id" | "service" | "cluster" | "latency" | "status";
export type SortDirection = "asc" | "desc";

export interface SortRule {
  field: SortField;
  direction: SortDirection;
}

export interface ColumnConfig {
  key: SortField;
  label: string;
  visible: boolean;
}

