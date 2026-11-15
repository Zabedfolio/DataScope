import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SortRule {
  field: string;
  direction: "asc" | "desc";
}

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
  sortRules: SortRule[];
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
  sortRules: [{ field: "timestamp", direction: "desc" }],
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
      state.sortRules = [{ field: action.payload.field, direction: action.payload.direction }];
      state.page = 1;
    },
    toggleSortRule: (
      state,
      action: PayloadAction<{ field: string; isMulti?: boolean }>
    ) => {
      const { field, isMulti = false } = action.payload;
      const existingIndex = state.sortRules.findIndex((r) => r.field === field);

      if (!isMulti) {
        // Single column toggle
        if (existingIndex !== -1 && state.sortRules.length === 1) {
          const nextDir = state.sortRules[0].direction === "desc" ? "asc" : "desc";
          state.sortRules = [{ field, direction: nextDir }];
          state.sortField = field;
          state.sortDirection = nextDir;
        } else {
          state.sortRules = [{ field, direction: "desc" }];
          state.sortField = field;
          state.sortDirection = "desc";
        }
      } else {
        // Multi-column toggle (Shift + click)
        if (existingIndex !== -1) {
          if (state.sortRules[existingIndex].direction === "desc") {
            state.sortRules[existingIndex].direction = "asc";
          } else {
            // Remove if already asc and multiple exist
            if (state.sortRules.length > 1) {
              state.sortRules.splice(existingIndex, 1);
            } else {
              state.sortRules[0].direction = "desc";
            }
          }
        } else {
          state.sortRules.push({ field, direction: "desc" });
        }
        if (state.sortRules.length > 0) {
          state.sortField = state.sortRules[0].field;
          state.sortDirection = state.sortRules[0].direction;
        }
      }
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
      state.sortRules = [{ field: "timestamp", direction: "desc" }];
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
  toggleSortRule,
  resetFilters,
} = searchSlice.actions;

export default searchSlice.reducer;

