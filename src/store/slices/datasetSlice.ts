import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DatasetState {
  selectedDatasetId: string;
  selectedDatasetSlug: string;
  selectedCluster: string | null;
  inspectedRecordId: string | null;
}

const initialState: DatasetState = {
  selectedDatasetId: "ds_k8s_telemetry",
  selectedDatasetSlug: "k8s-telemetry",
  selectedCluster: null,
  inspectedRecordId: null,
};

export const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    selectDataset: (
      state,
      action: PayloadAction<{ id: string; slug: string }>
    ) => {
      state.selectedDatasetId = action.payload.id;
      state.selectedDatasetSlug = action.payload.slug;
    },
    setClusterFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedCluster = action.payload;
    },
    inspectRecord: (state, action: PayloadAction<string | null>) => {
      state.inspectedRecordId = action.payload;
    },
    clearInspection: (state) => {
      state.inspectedRecordId = null;
    },
  },
});

export const {
  selectDataset,
  setClusterFilter,
  inspectRecord,
  clearInspection,
} = datasetSlice.actions;

export default datasetSlice.reducer;

