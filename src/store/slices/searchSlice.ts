import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  searchQuery: string;
  debouncedQuery: string;
  selectedService: string | null;
  selectedStatus: number | null;
  selectedCountry: string | null;
  minLatency: number | null;
  maxLatency: number | null;
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: "asc" | "desc";
}

const initialState: SearchState = {
  searchQuery: "",
  debouncedQuery: "",
  selectedService: null,
  selectedStatus: null,
  selectedCountry: null,
  minLatency: null,
  maxLatency: null,
  page: 1,
  pageSize: 25,
  sortField: "timestamp",
  sortDirection: "desc",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
      state.page = 1; // Reset to page 1 on new search
    },
    setSelectedService: (state, action: PayloadAction<string | null>) => {
      state.selectedService = action.payload;
      state.page = 1;
    },
    setSelectedStatus: (state, action: PayloadAction<number | null>) => {
      state.selectedStatus = action.payload;
      state.page = 1;
    },
    setSelectedCountry: (state, action: PayloadAction<string | null>) => {
      state.selectedCountry = action.payload;
      state.page = 1;
    },
    setLatencyRange: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) => {
      state.minLatency = action.payload.min;
      state.maxLatency = action.payload.max;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setSort: (
      state,
      action: PayloadAction<{ field: string; direction: "asc" | "desc" }>
    ) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.debouncedQuery = "";
      state.selectedService = null;
      state.selectedStatus = null;
      state.selectedCountry = null;
      state.minLatency = null;
      state.maxLatency = null;
      state.page = 1;
      state.sortField = "timestamp";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setSearchQuery,
  setDebouncedQuery,
  setSelectedService,
  setSelectedStatus,
  setSelectedCountry,
  setLatencyRange,
  setPage,
  setPageSize,
  setSort,
  resetFilters,
} = searchSlice.actions;

export default searchSlice.reducer;

