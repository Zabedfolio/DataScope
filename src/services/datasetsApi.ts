import { baseApi } from "./baseApi";
import { DatasetMetadata, StreamRecord } from "../features/explorer/types";

export interface AnalyticsData {
  totalRecords: number;
  statusBreakdown: { status: number; name: string; count: number }[];
  serviceBreakdown: { service: string; count: number; avgLatency: number }[];
  categoryBreakdown: { category: string; totalRecords: number; datasetCount: number }[];
  throughputTrend: { day: string; count: number }[];
  frequentlyUsedFilters: { rule: string; count: number; category: string }[];
}

export interface PaginatedRecordsResponse {
  data: StreamRecord[];
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  metrics: {
    scanTimeMs: number;
    indexedScan: boolean;
    returnedRows: number;
  };
}

export interface GetPaginatedRecordsParams {
  datasetId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: number | string;
  service?: string;
  cluster?: string;
  country?: string;
  minLatency?: number;
  maxLatency?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const datasetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDatasets: builder.query<DatasetMetadata[], void>({
      query: () => "/api/v1/datasets",
      transformResponse: (response: ApiResponse<DatasetMetadata[]>) => response.data,
      providesTags: ["Datasets"],
    }),

    getDatasetById: builder.query<DatasetMetadata, string>({
      query: (id) => `/api/v1/datasets/${id}`,
      transformResponse: (response: ApiResponse<DatasetMetadata>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Datasets", id }],
    }),

    getRecords: builder.query<PaginatedRecordsResponse, GetPaginatedRecordsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.datasetId) queryParams.set("datasetId", params.datasetId);
        if (params.page) queryParams.set("page", String(params.page));
        if (params.pageSize) queryParams.set("pageSize", String(params.pageSize));
        if (params.search) queryParams.set("search", params.search);
        if (params.status !== undefined && params.status !== null) queryParams.set("status", String(params.status));
        if (params.service) queryParams.set("service", params.service);
        if (params.cluster) queryParams.set("cluster", params.cluster);
        if (params.country) queryParams.set("country", params.country);
        if (params.minLatency !== undefined && params.minLatency !== null) queryParams.set("minLatency", String(params.minLatency));
        if (params.maxLatency !== undefined && params.maxLatency !== null) queryParams.set("maxLatency", String(params.maxLatency));
        if (params.sortField) queryParams.set("sortField", params.sortField);
        if (params.sortDirection) queryParams.set("sortDirection", params.sortDirection);

        return `/api/v1/records?${queryParams.toString()}`;
      },
      providesTags: ["Records"],
    }),

    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => "/api/v1/analytics/overview",
      transformResponse: (response: ApiResponse<AnalyticsData>) => response.data,
      providesTags: ["Records"],
    }),

    ingestRecord: builder.mutation<StreamRecord, Partial<StreamRecord> & { datasetId: string }>({
      query: (record) => ({
        url: "/api/v1/records/ingest",
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Records"],
    }),
  }),
});

export const {
  useGetDatasetsQuery,
  useGetDatasetByIdQuery,
  useGetRecordsQuery,
  useGetAnalyticsQuery,
  useIngestRecordMutation,
} = datasetsApi;
