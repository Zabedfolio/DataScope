import { baseApi } from "./baseApi";
import { SavedViewEntity } from "../features/views/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const viewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedViews: builder.query<SavedViewEntity[], void>({
      query: () => "/api/v1/views",
      transformResponse: (response: ApiResponse<SavedViewEntity[]>) => response.data,
      providesTags: ["Views"],
    }),

    createSavedView: builder.mutation<SavedViewEntity, Partial<SavedViewEntity>>({
      query: (view) => ({
        url: "/api/v1/views",
        method: "POST",
        body: view,
      }),
      invalidatesTags: ["Views"],
    }),

    toggleShareSavedView: builder.mutation<SavedViewEntity, string>({
      query: (id) => ({
        url: `/api/v1/views/${id}/share`,
        method: "PATCH",
      }),
      invalidatesTags: ["Views"],
    }),

    deleteSavedView: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/views/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Views"],
    }),
  }),
});

export const {
  useGetSavedViewsQuery,
  useCreateSavedViewMutation,
  useToggleShareSavedViewMutation,
  useDeleteSavedViewMutation,
} = viewsApi;

