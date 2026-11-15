"use client";

import { useState, useEffect, useCallback } from "react";
import { DatasetMetadata, StreamRecord } from "../types";

const SERVICE_MAP: Record<string, string[]> = {
  ds_k8s_telemetry: [
    "ingress-gateway",
    "query-engine",
    "auth-gateway",
    "mesh-proxy",
    "storage-node-03",
    "telemetry-aggregator",
  ],
  ds_fin_orderbook: [
    "matching-engine-01",
    "l2-snapshot-router",
    "hft-order-gateway",
    "execution-report-bus",
    "market-depth-feeder",
  ],
  ds_payment_ledger: [
    "vault-settlement-eu",
    "blake3-quorum-node",
    "ledger-audit-stream",
    "pci-token-exchange",
    "swift-gateway-node",
  ],
  ds_iot_sensor_mesh: [
    "turbine-thermo-04",
    "vibration-canbus-01",
    "edge-gateway-apac",
    "pressure-transducer-09",
    "telemetry-collector",
  ],
};

function generateSyntheticPacket(dataset: DatasetMetadata): StreamRecord {
  const datasetId = dataset.id || "ds_k8s_telemetry";
  const services = SERVICE_MAP[datasetId] || SERVICE_MAP.ds_k8s_telemetry;
  const service = services[Math.floor(Math.random() * services.length)];

  const methods: StreamRecord["method"][] = ["STREAM", "POST", "GET", "BATCH"];
  const method = methods[Math.floor(Math.random() * methods.length)];

  // Randomized status: 85% 200/201, 8% 401/429, 7% 500/502
  const rand = Math.random();
  let status: StreamRecord["status"] = 200;
  if (rand > 0.93) {
    status = Math.random() > 0.5 ? 500 : 503;
  } else if (rand > 0.85) {
    status = Math.random() > 0.5 ? 401 : 429;
  } else if (rand > 0.7) {
    status = 201;
  }

  // Realistic latency
  const latency = status >= 500
    ? Number((25 + Math.random() * 80).toFixed(2))
    : Number((0.15 + Math.random() * 2.2).toFixed(2));

  // Current timestamp formatted HH:MM:SS.mmm
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(
    now.getMilliseconds()
  ).padStart(3, "0")}`;

  const hexId = `pkt_0x${Math.random().toString(16).slice(2, 10)}`;

  let summary = `Live stream packet received from ${service}`;
  let payload: Record<string, unknown> = {};

  if (datasetId === "ds_fin_orderbook") {
    const symbol = ["NVDA", "AAPL", "MSFT", "GOOGL", "BTC/USD"][Math.floor(Math.random() * 5)];
    const price = Number((120 + Math.random() * 800).toFixed(2));
    const qty = Math.floor(10 + Math.random() * 500);
    summary = `L2 Tick: ${symbol} ${qty} shares @ $${price}`;
    payload = { symbol, price, qty, side: Math.random() > 0.5 ? "BUY" : "SELL", match_latency_us: Math.floor(latency * 1000) };
  } else if (datasetId === "ds_payment_ledger") {
    const amount = Math.floor(5000 + Math.random() * 250000);
    summary = `Quorum settlement: $${(amount / 100).toFixed(2)} USD signed with Blake3`;
    payload = { amount_cents: amount, currency: "USD", confirmed_nodes: 16, quorum_reached: true };
  } else if (datasetId === "ds_iot_sensor_mesh") {
    const temp = Number((65 + Math.random() * 35).toFixed(1));
    const vib = Number((0.2 + Math.random() * 4.8).toFixed(2));
    summary = `Sensor telemetry: Temp ${temp}°C, Vibration ${vib}g`;
    payload = { temperature_c: temp, vibration_g: vib, battery_pct: 94 };
  } else {
    summary = status >= 500
      ? `Mesh gateway error: downstream circuit open on ${service}`
      : `Ingested ${Math.floor(1024 + Math.random() * 65536)} bytes telemetry from ${service}`;
    payload = {
      stream_id: `str_${Math.random().toString(36).slice(2, 8)}`,
      status_code: status,
      trace_id: `0x${Math.random().toString(16).slice(2, 18)}`,
    };
  }

  return {
    id: hexId,
    timestamp: timeStr,
    cluster: dataset.cluster.split(" ")[0] || "us-east-1a",
    service,
    method,
    latency,
    status,
    summary,
    payload,
    rawHex: `00000000: 4461 7461 5363 6f70 6500 0100 ${hexId.slice(6, 10)}  DataScope.......\n00000010: 0000 0001 0000 0000 0000 0000 0000 0000  ................`,
    tags: [dataset.slug, service],
  };
}

export function useStreamSimulator(
  dataset: DatasetMetadata,
  initialRecords: StreamRecord[],
  maxBufferSize = 250
) {
  const [records, setRecords] = useState<StreamRecord[]>(initialRecords);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamRate, setStreamRate] = useState<1 | 3 | 5 | 10>(1); // Packets per second
  const [newlyIngestedIds, setNewlyIngestedIds] = useState<Set<string>>(new Set());
  const [ingestedCount, setIngestedCount] = useState(0);

  // Sync initial records when dataset changes
  useEffect(() => {
    setRecords(initialRecords);
    setNewlyIngestedIds(new Set());
  }, [dataset.id, initialRecords]);

  // Interval worker for packet generation
  useEffect(() => {
    if (!isStreaming) return;

    const intervalMs = Math.floor(1000 / streamRate);
    const interval = setInterval(() => {
      const packet = generateSyntheticPacket(dataset);

      setRecords((prev) => {
        const next = [packet, ...prev];
        return next.length > maxBufferSize ? next.slice(0, maxBufferSize) : next;
      });

      setNewlyIngestedIds((prev) => {
        const next = new Set(prev);
        next.add(packet.id);
        return next;
      });

      setIngestedCount((c) => c + 1);

      // Remove glow after 1.5s
      setTimeout(() => {
        setNewlyIngestedIds((prev) => {
          if (!prev.has(packet.id)) return prev;
          const next = new Set(prev);
          next.delete(packet.id);
          return next;
        });
      }, 1500);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamRate, dataset, maxBufferSize]);

  const toggleStreaming = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  const clearRecords = useCallback(() => {
    setRecords([]);
  }, []);

  return {
    records,
    isStreaming,
    toggleStreaming,
    streamRate,
    setStreamRate,
    newlyIngestedIds,
    ingestedCount,
    clearRecords,
  };
}
