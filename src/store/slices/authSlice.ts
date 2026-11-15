import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "Administrator" | "Data Analyst" | "Viewer";

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  } | null;
  isAuthenticated: boolean;
  permissions: string[];
}

const INITIAL_PERMISSIONS_BY_ROLE: Record<UserRole, string[]> = {
  Administrator: [
    "manage_users",
    "manage_datasets",
    "configure_permissions",
    "view_analytics",
    "export_data",
    "advanced_search",
  ],
  "Data Analyst": [
    "explore_datasets",
    "advanced_search",
    "save_views",
    "share_views",
    "export_data",
    "view_analytics",
  ],
  Viewer: [
    "browse_datasets",
    "basic_search",
    "view_record_details",
    "view_saved_views",
  ],
};

const initialState: AuthState = {
  user: {
    id: "usr_alex_mercer",
    name: "Alex Mercer",
    email: "alex.mercer@enterprise.io",
    role: "Data Analyst",
  },
  isAuthenticated: true,
  permissions: INITIAL_PERMISSIONS_BY_ROLE["Data Analyst"],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.permissions = INITIAL_PERMISSIONS_BY_ROLE[action.payload.role] || [];
      } else {
        state.permissions = [];
      }
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
        state.permissions = INITIAL_PERMISSIONS_BY_ROLE[action.payload];
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
    },
  },
});

export const { setUser, setRole, logout } = authSlice.actions;
export default authSlice.reducer;

