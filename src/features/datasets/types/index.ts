export interface SchemaField {
  name: string;
  type: "UUIDv7" | "uint64_t" | "int32_t" | "float64" | "string" | "boolean" | "timestamp" | "Protobuf[Wire]" | "JSON";
  indexed: boolean;
  nullable: boolean;
  description: string;
}

export type DatasetCategory = "All" | "Streaming" | "Financial" | "Security" | "IoT" | "Infrastructure";

export type AccessLevel = "Public" | "Enterprise" | "Restricted";

export interface CatalogDataset {
  id: string;
  name: string;
  slug: string;
  category: DatasetCategory;
  description: string;
  recordCount: number;
  byteSizeFormatted: string;
  cluster: string;
  throughputRate: string;
  syncFrequency: string;
  accessLevel: AccessLevel;
  tags: string[];
  schemaFields: SchemaField[];
}

