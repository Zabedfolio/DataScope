import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ColumnSetting {
  key: string;
  label: string;
  visible: boolean;
}

export interface UiPreferenceState {
  density: "compact" | "comfortable";
  columns: ColumnSetting[];
  isSidebarCollapsed: boolean;
  theme: "dark" | "light";
}

const DEFAULT_COLUMNS: ColumnSetting[] = [
  { key: "timestamp", label: "Time", visible: true },
  { key: "id", label: "Stream ID", visible: true },
  { key: "service", label: "Service / Method", visible: true },
  { key: "cluster", label: "Cluster", visible: true },
  { key: "latency", label: "Latency", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "country", label: "Country", visible: false },
  { key: "revenue", label: "Revenue", visible: false },
];

const initialState: UiPreferenceState = {
  density: "compact",
  columns: DEFAULT_COLUMNS,
  isSidebarCollapsed: false,
  theme: "dark",
};

export const uiPreferenceSlice = createSlice({
  name: "uiPreference",
  initialState,
  reducers: {
    setDensity: (
      state,
      action: PayloadAction<"compact" | "comfortable">
    ) => {
      state.density = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const col = state.columns.find((c) => c.key === action.payload);
      if (col) {
        col.visible = !col.visible;
      }
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setDensity,
  toggleColumnVisibility,
  setSidebarCollapsed,
  setTheme,
} = uiPreferenceSlice.actions;

export default uiPreferenceSlice.reducer;
