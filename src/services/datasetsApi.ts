import { baseApi } from "./baseApi";
import { DatasetMetadata, StreamRecord } from "../features/explorer/types";

interface GetRecordsParams {
  datasetId: string;
  limit?: number;
  offset?: number;
  search?: string;
  service?: string;
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

    getDatasetRecords: builder.query<StreamRecord[], GetRecordsParams>({
      query: ({ datasetId, limit = 50, offset = 0, search, service }) => {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        });
        if (search) params.append("search", search);
        if (service) params.append("service", service);
        return `/api/v1/datasets/${datasetId}/records?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<StreamRecord[]>) => response.data,
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
  useGetDatasetRecordsQuery,
  useIngestRecordMutation,
} = datasetsApi;

