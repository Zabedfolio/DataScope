import { describe, it, expect } from "vitest";
import authReducer, { setUser, setRole, logout } from "../authSlice";

describe("authSlice reducer", () => {
  it("initializes with default mock analyst user", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.role).toBe("Data Analyst");
    expect(state.permissions).toContain("export_data");
    expect(state.permissions).toContain("explore_datasets");
  });

  it("updates permissions correctly when changing role to Administrator", () => {
    let state = authReducer(undefined, { type: "@@INIT" });
    state = authReducer(state, setRole("Administrator"));
    expect(state.user?.role).toBe("Administrator");
    expect(state.permissions).toContain("manage_users");
    expect(state.permissions).toContain("manage_datasets");
  });

  it("restricts permissions when downgraded to Viewer", () => {
    let state = authReducer(undefined, { type: "@@INIT" });
    state = authReducer(state, setRole("Viewer"));
    expect(state.user?.role).toBe("Viewer");
    expect(state.permissions).not.toContain("manage_datasets");
    expect(state.permissions).not.toContain("export_data");
  });

  it("clears state on logout", () => {
    let state = authReducer(undefined, { type: "@@INIT" });
    state = authReducer(state, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.permissions).toEqual([]);
  });
});
