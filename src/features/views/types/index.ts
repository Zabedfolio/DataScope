export interface SavedViewEntity {
  id: string;
  title: string;
  slug: string;
  datasetName: string;
  datasetId: string;
  description: string;
  filterRules: string[];
  lastRunLatencyMs: number;
  recordsMatched: number;
  sharedWithTeam: boolean;
  updatedAt: string;
}

