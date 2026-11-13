export interface DemoRecord {
  id: string;
  timestamp: string;
  cluster: string;
  service: string;
  method: "POST" | "GET" | "STREAM" | "BATCH";
  latency: number; // in milliseconds
  status: 200 | 201 | 400 | 401 | 429 | 500 | 503;
  payload: Record<string, unknown>;
  summary: string;
}

export const DEMO_PRESET_FILTERS = [
  { id: "all", label: "All Streams" },
  { id: "errors", label: "Errors (4xx / 5xx)" },
  { id: "high-latency", label: "High Latency (>20ms)" },
  { id: "auth", label: "Auth & Security" },
  { id: "ingestion", label: "Binary Ingestion" },
] as const;

export type PresetFilterId = (typeof DEMO_PRESET_FILTERS)[number]["id"];

export const MOCK_EXPLORER_RECORDS: DemoRecord[] = [
  {
    id: "pkt_0x8f4a21e0",
    timestamp: "14:52:08.412",
    cluster: "us-east-1a",
    service: "binary-ingest",
    method: "STREAM",
    latency: 0.28,
    status: 200,
    summary: "Ingested 1,048,576 bytes binary telemetry stream from node-mesh-04",
    payload: {
      stream_id: "str_live_telemetry_v2",
      byte_count: 1048576,
      checksum: "0x7F4A8C01B3",
      compression: "zstd-fast",
      compression_ratio: 0.42,
      shards_mapped: ["shard-01", "shard-03", "shard-07"],
    },
  },
  {
    id: "pkt_0x9a3c10f8",
    timestamp: "14:52:08.398",
    cluster: "us-east-1b",
    service: "query-engine",
    method: "GET",
    latency: 0.34,
    status: 200,
    summary: "Executed sub-millisecond memory-mapped index lookup for tenant_9942",
    payload: {
      query: "SELECT telemetry FROM stream WHERE fid = '0x9942' LIMIT 50",
      cache_hit: true,
      storage_tier: "NVMe-mmap",
      scanned_rows: 48200,
      scan_duration_us: 340,
    },
  },
  {
    id: "pkt_0x7b11d942",
    timestamp: "14:52:07.982",
    cluster: "eu-west-1c",
    service: "auth-gateway",
    method: "POST",
    latency: 1.15,
    status: 200,
    summary: "Validated mTLS cryptographic token for enterprise agent runner",
    payload: {
      auth_mechanism: "mTLS-ECDSA",
      issuer: "DataScope-Internal-CA-01",
      session_ttl_sec: 3600,
      client_ip: "10.240.18.99",
      role: "ANALYST_ENTERPRISE",
    },
  },
  {
    id: "pkt_0x6c29e811",
    timestamp: "14:52:07.721",
    cluster: "ap-southeast-1a",
    service: "shard-replicator",
    method: "BATCH",
    latency: 38.4,
    status: 503,
    summary: "Cross-region quorum sync timeout between ap-southeast-1a and us-east-1",
    payload: {
      replication_id: "rep_sync_482109",
      primary_cluster: "us-east-1",
      replica_target: "ap-southeast-1a",
      round_trip_ms: 184.2,
      error_code: "QUORUM_ACK_TIMEOUT",
      retry_attempt: 2,
    },
  },
  {
    id: "pkt_0x5f81a704",
    timestamp: "14:52:06.840",
    cluster: "us-east-1a",
    service: "auth-gateway",
    method: "POST",
    latency: 4.82,
    status: 401,
    summary: "Rejected handshake: Expired Bearer signature for worker svc-084",
    payload: {
      attempted_user: "svc-crawler-sync@enterprise.internal",
      reason: "TOKEN_EXPIRED_SIGNATURE",
      token_expiry: "2026-11-13T14:45:00Z",
      client_agent: "DataScope-Agent/0.9.1",
    },
  },
  {
    id: "pkt_0x4e72c519",
    timestamp: "14:52:06.115",
    cluster: "us-west-2a",
    service: "binary-ingest",
    method: "STREAM",
    latency: 0.31,
    status: 200,
    summary: "Committed high-frequency financial order tick snapshot (8,192 events)",
    payload: {
      market_stream: "EQUITIES_TICK_L2",
      symbols_parsed: 1420,
      events_committed: 8192,
      serialization_format: "CapnProto",
      storage_overhead_bytes: 0,
    },
  },
  {
    id: "pkt_0x3d63b428",
    timestamp: "14:52:05.904",
    cluster: "us-east-1c",
    service: "rate-limiter",
    method: "POST",
    latency: 0.18,
    status: 429,
    summary: "Rate limit exceeded: IP 198.51.100.41 hit 50,000 req/min threshold",
    payload: {
      throttled_ip: "198.51.100.41",
      bucket: "public-api-tier-1",
      current_rate: 51240,
      max_limit: 50000,
      retry_after_sec: 12,
    },
  },
  {
    id: "pkt_0x2c54a337",
    timestamp: "14:52:05.420",
    cluster: "eu-central-1a",
    service: "nvme-storage",
    method: "BATCH",
    latency: 0.45,
    status: 200,
    summary: "Flushed 64MB dirty write buffer to PCIe Gen5 NVMe direct ring",
    payload: {
      block_offset: "0x1A00000",
      bytes_written: 67108864,
      iops: 128400,
      drive_temp_celsius: 42.1,
      health_status: "HEALTHY",
    },
  },
  {
    id: "pkt_0x1b459246",
    timestamp: "14:52:04.992",
    cluster: "us-east-1a",
    service: "parser-engine",
    method: "STREAM",
    latency: 82.6,
    status: 500,
    summary: "Decoder panic: Corrupted protobuf wire-type at byte offset 0x48A0",
    payload: {
      stream_channel: "legacy-sensor-iot",
      byte_offset: "0x48A0",
      expected_wire_type: 2,
      received_wire_type: 7,
      quarantine_buffer_id: "qbuf_0x99A82",
    },
  },
  {
    id: "pkt_0x0a368155",
    timestamp: "14:52:04.180",
    cluster: "us-west-2b",
    service: "query-engine",
    method: "GET",
    latency: 0.39,
    status: 200,
    summary: "Executed multidimensional aggregate query over 1,200,000 datapoints",
    payload: {
      dimensions: ["cluster", "status", "latency_bucket"],
      aggregates: ["AVG(latency)", "COUNT(id)", "P99(latency)"],
      scanned_records: 1200000,
      execution_time_ms: 0.39,
    },
  },
];

