import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import authReducer from "./slices/authSlice";
import datasetReducer from "./slices/datasetSlice";
import searchReducer from "./slices/searchSlice";
import savedViewsReducer from "./slices/savedViewsSlice";
import uiPreferenceReducer from "./slices/uiPreferenceSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      dataset: datasetReducer,
      search: searchReducer,
      savedViews: savedViewsReducer,
      uiPreference: uiPreferenceReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
