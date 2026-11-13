export interface MetricItem {
  id: string;
  value: string;
  unit?: string;
  label: string;
  description: string;
  badge?: string;
}

export const PLATFORM_METRICS: MetricItem[] = [
  {
    id: "throughput",
    value: "2.48B+",
    unit: "bits/s",
    label: "Ingestion Throughput",
    description: "High-concurrency streaming ingest across distributed clusters",
    badge: "Real-time",
  },
  {
    id: "latency",
    value: "< 0.4ms",
    label: "Query Latency",
    description: "Sub-millisecond retrieval with NVMe memory-mapped cache",
    badge: "p99",
  },
  {
    id: "fidelity",
    value: "99.99%",
    label: "Data Fidelity",
    description: "Cryptographic byte-level validation across every stream",
    badge: "Verified",
  },
  {
    id: "pipelines",
    value: "Zero-ETL",
    label: "Automated Discovery",
    description: "Instant structural discovery without complex manual ETL scripts",
    badge: "Automated",
  },
];

