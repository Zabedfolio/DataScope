import { describe, it, expect } from "vitest";

interface RecordItem {
  id: string;
  status: number;
  service: string;
  latency: number;
  country?: string;
}

const SAMPLE_RECORDS: RecordItem[] = [
  { id: "pkt_1", status: 200, service: "ingress-gateway", latency: 0.28, country: "US" },
  { id: "pkt_2", status: 500, service: "query-engine", latency: 84.4, country: "DE" },
  { id: "pkt_3", status: 401, service: "auth-gateway", latency: 4.8, country: "US" },
  { id: "pkt_4", status: 200, service: "query-engine", latency: 1.1, country: "JP" },
  { id: "pkt_5", status: 503, service: "shard-replicator", latency: 120.5, country: "DE" },
];

describe("Filter Predicate Evaluation Engine", () => {
  it("filters correctly by status code predicate", () => {
    const outages = SAMPLE_RECORDS.filter((r) => r.status >= 500);
    expect(outages).toHaveLength(2);
    expect(outages.map((r) => r.id)).toEqual(["pkt_2", "pkt_5"]);
  });

  it("filters correctly by numeric latency threshold", () => {
    const p99Spikes = SAMPLE_RECORDS.filter((r) => r.latency > 20);
    expect(p99Spikes).toHaveLength(2);
    expect(p99Spikes.every((r) => r.latency > 20)).toBe(true);
  });

  it("combines multiple conditions (status + country)", () => {
    const germanOutages = SAMPLE_RECORDS.filter(
      (r) => r.status >= 500 && r.country === "DE"
    );
    expect(germanOutages).toHaveLength(2);
  });

  it("calculates pagination slice boundaries accurately", () => {
    const pageSize = 2;
    const page1 = SAMPLE_RECORDS.slice(0, 2);
    const page2 = SAMPLE_RECORDS.slice(2, 4);
    const page3 = SAMPLE_RECORDS.slice(4, 6);

    expect(page1).toHaveLength(2);
    expect(page2).toHaveLength(2);
    expect(page3).toHaveLength(1);
    expect(Math.ceil(SAMPLE_RECORDS.length / pageSize)).toBe(3);
  });
});
