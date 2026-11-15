"use client";

import React from "react";
import { QueryRule, QueryOperator } from "../types";

const AVAILABLE_FIELDS = [
  { value: "status", label: "Status Code (int)" },
  { value: "latency", label: "Latency ms (float)" },
  { value: "service", label: "Service Name (string)" },
  { value: "cluster", label: "Cluster Region (string)" },
  { value: "id", label: "Stream Packet ID (uuid)" },
  { value: "summary", label: "Payload Summary (text)" },
];

const OPERATORS: { value: QueryOperator; label: string }[] = [
  { value: "=", label: "= (Equals)" },
  { value: "!=", label: "!= (Not Equals)" },
  { value: ">", label: "> (Greater than)" },
  { value: "<", label: "< (Less than)" },
  { value: ">=", label: ">= (Greater or Equal)" },
  { value: "<=", label: "<= (Less or Equal)" },
  { value: "CONTAINS", label: "CONTAINS (Text match)" },
  { value: "REGEX", label: "REGEX (~ Match)" },
];

interface QueryRuleRowProps {
  rule: QueryRule;
  onChangeRule: (updated: QueryRule) => void;
  onRemoveRule: () => void;
  canRemove: boolean;
}

export function QueryRuleRow({
  rule,
  onChangeRule,
  onRemoveRule,
  canRemove,
}: QueryRuleRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 transition-all">
      {/* Field Selector */}
      <select
        value={rule.field}
        onChange={(e) => onChangeRule({ ...rule, field: e.target.value })}
        className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D69A]"
      >
        {AVAILABLE_FIELDS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Operator Selector */}
      <select
        value={rule.operator}
        onChange={(e) => onChangeRule({ ...rule, operator: e.target.value as QueryOperator })}
        className="px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-emerald-600 dark:text-[#00D69A] focus:outline-none focus:ring-2 focus:ring-[#00D69A]"
      >
        {OPERATORS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value Input */}
      <input
        type="text"
        value={rule.value}
        onChange={(e) => onChangeRule({ ...rule, value: e.target.value })}
        placeholder="Enter comparison value (e.g. 500, us-east, 20)..."
        className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#051013] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A]"
      />

      {/* Delete Rule Action */}
      {canRemove && (
        <button
          type="button"
          onClick={onRemoveRule}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors self-end sm:self-center"
          title="Delete rule"
          aria-label="Delete rule"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

