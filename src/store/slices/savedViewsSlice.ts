import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavedViewsState {
  activeViewId: string | null;
  filterTab: "all" | "shared" | "private";
  searchQuery: string;
}

const initialState: SavedViewsState = {
  activeViewId: null,
  filterTab: "all",
  searchQuery: "",
};

export const savedViewsSlice = createSlice({
  name: "savedViews",
  initialState,
  reducers: {
    setActiveViewId: (state, action: PayloadAction<string | null>) => {
      state.activeViewId = action.payload;
    },
    setFilterTab: (
      state,
      action: PayloadAction<"all" | "shared" | "private">
    ) => {
      state.filterTab = action.payload;
    },
    setViewSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setActiveViewId, setFilterTab, setViewSearchQuery } =
  savedViewsSlice.actions;

export default savedViewsSlice.reducer;

