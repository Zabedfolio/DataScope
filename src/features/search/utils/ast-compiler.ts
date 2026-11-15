import { QueryGroup, QueryRule, CompiledQuery } from "../types";

export function compileRuleToSql(rule: QueryRule): string {
  if (!rule.value.trim()) return "1=1";

  const isNumeric = !isNaN(Number(rule.value)) && !rule.value.includes("-");
  const formattedVal = isNumeric ? rule.value : `'${rule.value.replace(/'/g, "''")}'`;

  switch (rule.operator) {
    case "=":
      return `${rule.field} = ${formattedVal}`;
    case "!=":
      return `${rule.field} != ${formattedVal}`;
    case ">":
      return `${rule.field} > ${formattedVal}`;
    case "<":
      return `${rule.field} < ${formattedVal}`;
    case ">=":
      return `${rule.field} >= ${formattedVal}`;
    case "<=":
      return `${rule.field} <= ${formattedVal}`;
    case "CONTAINS":
      return `${rule.field} ILIKE '%${rule.value}%'`;
    case "REGEX":
      return `${rule.field} ~ '${rule.value}'`;
    default:
      return `${rule.field} = ${formattedVal}`;
  }
}

export function compileGroupToSql(group: QueryGroup, datasetSlug = "k8s_telemetry"): string {
  const parts: string[] = [];

  for (const rule of group.rules) {
    parts.push(compileRuleToSql(rule));
  }

  if (group.subGroups && group.subGroups.length > 0) {
    for (const sub of group.subGroups) {
      const subSql = compileGroupToSql(sub, datasetSlug);
      parts.push(`(${subSql})`);
    }
  }

  if (parts.length === 0) return "1=1";
  return parts.join(` ${group.combinator} `);
}

export function compileToFullQuery(group: QueryGroup, datasetSlug = "k8s_telemetry"): CompiledQuery {
  const whereClause = compileGroupToSql(group, datasetSlug);
  const sql = `SELECT\n  trace_id,\n  service_name,\n  cluster,\n  latency_us,\n  status_code,\n  payload\nFROM stream_${datasetSlug}\nWHERE ${whereClause}\nORDER BY timestamp DESC\nLIMIT 100;`;

  const predicateArg = whereClause.replace(/\n/g, " ");
  const cliCommand = `datascope query --dataset "${datasetSlug}" --where "${predicateArg}" --format json --simd-avx512`;

  return {
    sql,
    cliCommand,
    estimatedLatencyMs: 0.38,
  };
}

export function evaluateRecordMatch(record: {
  id: string;
  service: string;
  cluster: string;
  latency: number;
  status: number;
  summary: string;
}, group: QueryGroup): boolean {
  const evaluateRule = (rule: QueryRule): boolean => {
    if (!rule.value.trim()) return true;
    let recVal: string | number = "";
    if (rule.field === "status") recVal = record.status;
    else if (rule.field === "latency") recVal = record.latency;
    else if (rule.field === "service") recVal = record.service;
    else if (rule.field === "cluster") recVal = record.cluster;
    else if (rule.field === "id") recVal = record.id;
    else recVal = record.summary;

    const queryVal = rule.value.toLowerCase();
    const strRecVal = String(recVal).toLowerCase();

    switch (rule.operator) {
      case "=":
        return strRecVal === queryVal;
      case "!=":
        return strRecVal !== queryVal;
      case ">":
        return Number(recVal) > Number(rule.value);
      case "<":
        return Number(recVal) < Number(rule.value);
      case ">=":
        return Number(recVal) >= Number(rule.value);
      case "<=":
        return Number(recVal) <= Number(rule.value);
      case "CONTAINS":
        return strRecVal.includes(queryVal);
      case "REGEX":
        try {
          return new RegExp(rule.value, "i").test(strRecVal);
        } catch {
          return false;
        }
      default:
        return true;
    }
  };

  const ruleMatches = group.rules.map(evaluateRule);
  const subMatches = (group.subGroups || []).map((sub) => evaluateRecordMatch(record, sub));
  const allMatches = [...ruleMatches, ...subMatches];

  if (allMatches.length === 0) return true;

  if (group.combinator === "AND") {
    return allMatches.every(Boolean);
  } else {
    return allMatches.some(Boolean);
  }
}

