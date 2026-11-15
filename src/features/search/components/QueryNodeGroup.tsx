"use client";

import React from "react";
import { QueryGroup, QueryRule } from "../types";
import { QueryRuleRow } from "./QueryRuleRow";

interface QueryNodeGroupProps {
  group: QueryGroup;
  onChangeGroup: (updated: QueryGroup) => void;
  onRemoveGroup?: () => void;
  depth?: number;
}

export function QueryNodeGroup({
  group,
  onChangeGroup,
  onRemoveGroup,
  depth = 0,
}: QueryNodeGroupProps) {
  // Update rule
  const handleUpdateRule = (ruleIndex: number, updatedRule: QueryRule) => {
    const newRules = [...group.rules];
    newRules[ruleIndex] = updatedRule;
    onChangeGroup({ ...group, rules: newRules });
  };

  // Add rule
  const handleAddRule = () => {
    const newRule: QueryRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      field: "status",
      operator: "=",
      value: "",
    };
    onChangeGroup({ ...group, rules: [...group.rules, newRule] });
  };

  // Remove rule
  const handleRemoveRule = (ruleIndex: number) => {
    const newRules = group.rules.filter((_, idx) => idx !== ruleIndex);
    onChangeGroup({ ...group, rules: newRules });
  };

  // Add sub-group
  const handleAddSubGroup = () => {
    const newSubGroup: QueryGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      combinator: group.combinator === "AND" ? "OR" : "AND",
      rules: [
        {
          id: `rule_${Date.now()}`,
          field: "latency",
          operator: ">",
          value: "20",
        },
      ],
      subGroups: [],
    };
    onChangeGroup({
      ...group,
      subGroups: [...(group.subGroups || []), newSubGroup],
    });
  };

  // Update sub-group
  const handleUpdateSubGroup = (subIndex: number, updatedSub: QueryGroup) => {
    const newSubGroups = [...(group.subGroups || [])];
    newSubGroups[subIndex] = updatedSub;
    onChangeGroup({ ...group, subGroups: newSubGroups });
  };

  // Remove sub-group
  const handleRemoveSubGroup = (subIndex: number) => {
    const newSubGroups = (group.subGroups || []).filter((_, idx) => idx !== subIndex);
    onChangeGroup({ ...group, subGroups: newSubGroups });
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all ${
        depth === 0
          ? "border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#07171C]/90 p-4 sm:p-6 shadow-lg"
          : "border-dashed border-emerald-500/30 bg-slate-50/50 dark:bg-white/[0.02] p-3 sm:p-4 mt-3"
      }`}
    >
      {/* Group Header Controls */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Combine Rules:
          </span>

          {/* AND / OR Combinator Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-[#051013] text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => onChangeGroup({ ...group, combinator: "AND" })}
              className={`px-2.5 py-1 rounded transition-all ${
                group.combinator === "AND"
                  ? "bg-[#00D69A] text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              AND (All match)
            </button>
            <button
              type="button"
              onClick={() => onChangeGroup({ ...group, combinator: "OR" })}
              className={`px-2.5 py-1 rounded transition-all ${
                group.combinator === "OR"
                  ? "bg-[#00D69A] text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              OR (Any match)
            </button>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={handleAddRule}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-[#00D69A] border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-medium"
          >
            <span>+ Add Condition</span>
          </button>

          {depth < 2 && (
            <button
              type="button"
              onClick={handleAddSubGroup}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium"
            >
              <span>+ Add Sub-Group</span>
            </button>
          )}

          {onRemoveGroup && (
            <button
              type="button"
              onClick={onRemoveGroup}
              className="text-xs text-rose-500 hover:underline px-1.5 py-1"
            >
              Remove Group
            </button>
          )}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-2">
        {group.rules.map((rule, idx) => (
          <QueryRuleRow
            key={rule.id}
            rule={rule}
            onChangeRule={(updated) => handleUpdateRule(idx, updated)}
            onRemoveRule={() => handleRemoveRule(idx)}
            canRemove={Boolean(group.rules.length > 1 || (group.subGroups && group.subGroups.length > 0))}
          />
        ))}
      </div>

      {/* Nested Sub-Groups */}
      {group.subGroups && group.subGroups.length > 0 && (
        <div className="space-y-3 mt-3">
          {group.subGroups.map((sub, sIdx) => (
            <QueryNodeGroup
              key={sub.id}
              group={sub}
              depth={depth + 1}
              onChangeGroup={(updated) => handleUpdateSubGroup(sIdx, updated)}
              onRemoveGroup={() => handleRemoveSubGroup(sIdx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
