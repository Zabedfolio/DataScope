export interface PipelineStep {
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  terminalSnippet: {
    command: string;
    output: string;
    accent: string;
  };
  metrics: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: "01",
    badge: "INGESTION PHASE",
    title: "Connect & Stream",
    subtitle: "Zero-configuration wire ingestion",
    description:
      "Point any Kafka broker, gRPC stream, WebSocket, or raw TCP socket to DataScope. No custom serialization agents or schema registries required.",
    terminalSnippet: {
      command: "datascope connect --stream tcp://node:9042",
      output: "✓ Socket bound • 2.48 Gbps wire capacity",
      accent: "text-cyan-400",
    },
    metrics: "TLS 1.3 • Zero Agent Overhead",
  },
  {
    step: "02",
    badge: "STORAGE CORE",
    title: "Zero-Copy Memory Mapping",
    description:
      "Packets are cryptographically checksummed and mapped directly into kernel-bypass NVMe ring buffers without intermediate disk serialization or garbage collection.",
    subtitle: "Hardware-accelerated memory rings",
    terminalSnippet: {
      command: "datascope ring status --device nvme0n1",
      output: "✓ 64MB buffer active • 0 copies in memory",
      accent: "text-[#00D69A]",
    },
    metrics: "PCIe Gen5 • Blake3 Verified",
  },
  {
    step: "03",
    badge: "QUERY ENGINE",
    title: "Sub-Millisecond Retrieval",
    subtitle: "Vectorized SIMD search execution",
    description:
      "Execute multidimensional visual AST queries or raw filter predicates across billions of unindexed records in sub-0.4ms.",
    terminalSnippet: {
      command: "datascope query \"latency > 50ms\"",
      output: "✓ 48,200 rows matched in 0.38ms",
      accent: "text-emerald-400",
    },
    metrics: "< 0.4ms p99 • AVX-512 Compiled",
  },
];

