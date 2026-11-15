export interface FeatureCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlightText?: string;
  codeSnippet?: string;
  visualType: "code" | "stat" | "architecture" | "security" | "pipeline";
  colSpanDesktop: string; // Tailwind class e.g. "lg:col-span-2" or "lg:col-span-1"
}

export const PLATFORM_FEATURES: FeatureCard[] = [
  {
    id: "binary-ingest",
    badge: "ZERO-COPY ARCHITECTURE",
    title: "Sub-Millisecond Binary Ingestion",
    description:
      "Ingest raw binary packets, protobuf wire formats, and telemetry streams directly into memory-mapped NVMe rings with zero intermediate serialization overhead.",
    highlightText: "2.48B+ bits/sec per cluster node with < 0.4ms p99 latency.",
    visualType: "architecture",
    colSpanDesktop: "lg:col-span-2",
  },
  {
    id: "schema-inference",
    badge: "AUTO-DISCOVERY",
    title: "Schema-Free Type Inference",
    description:
      "Eliminate fragile ETL pipelines. DataScope instantly reconstructs nested object trees and structural schemas from raw byte offsets in real time.",
    highlightText: "Instant JSON, Cap'n Proto & Protobuf wire auto-detection.",
    visualType: "code",
    colSpanDesktop: "lg:col-span-1",
  },
  {
    id: "visual-ast",
    badge: "QUERY ENGINE",
    title: "Multidimensional AST Query Compiler",
    description:
      "Compose complex Boolean search trees with instant visual feedback. Queries compile to vectorized SIMD instructions executed across distributed cluster shards.",
    highlightText: "Instant aggregate statistics over 10M+ unindexed records.",
    visualType: "stat",
    colSpanDesktop: "lg:col-span-1",
  },
  {
    id: "cryptographic-fidelity",
    badge: "DATA INTEGRITY",
    title: "Byte-Level Checksum Verification",
    description:
      "Continuous cryptographic validation ensures zero bit-rot or packet dropped during high-velocity cross-region replication.",
    highlightText: "99.999% fidelity guarantee with SHA-256 and Blake3 byte verification.",
    visualType: "security",
    colSpanDesktop: "lg:col-span-2",
  },
];

