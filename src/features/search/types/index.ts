export type QueryOperator =
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "CONTAINS"
  | "REGEX";

export interface QueryRule {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string;
}

export interface QueryGroup {
  id: string;
  combinator: "AND" | "OR";
  rules: QueryRule[];
  subGroups?: QueryGroup[];
}

export interface CompiledQuery {
  sql: string;
  cliCommand: string;
  estimatedLatencyMs: number;
}

