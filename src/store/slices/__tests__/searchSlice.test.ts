import { describe, it, expect } from "vitest";
import searchReducer, {
  setSearchQuery,
  setDebouncedQuery,
  setSelectedService,
  setSelectedStatus,
  setPage,
  setPageSize,
  setSort,
  toggleSortRule,
  resetFilters,
  SearchState,
} from "../searchSlice";

describe("searchSlice reducer", () => {
  const initial: SearchState = {
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

  it("handles setSearchQuery and setDebouncedQuery", () => {
    let state = searchReducer(initial, setSearchQuery("auth-gateway"));
    expect(state.searchQuery).toBe("auth-gateway");

    state = searchReducer(state, setPage(5));
    expect(state.page).toBe(5);

    // Debounced query resets page to 1
    state = searchReducer(state, setDebouncedQuery("auth-gateway"));
    expect(state.debouncedQuery).toBe("auth-gateway");
    expect(state.page).toBe(1);
  });

  it("handles filter changes and resets page", () => {
    let state = searchReducer(initial, setPage(3));
    state = searchReducer(state, setSelectedService("query-engine"));
    expect(state.selectedService).toBe("query-engine");
    expect(state.page).toBe(1);

    state = searchReducer(state, setSelectedStatus(500));
    expect(state.selectedStatus).toBe(500);
  });

  it("handles single-column sort toggle", () => {
    let state = searchReducer(initial, toggleSortRule({ field: "latency", isMulti: false }));
    expect(state.sortField).toBe("latency");
    expect(state.sortDirection).toBe("desc");
    expect(state.sortRules).toEqual([{ field: "latency", direction: "desc" }]);

    // Toggle same column
    state = searchReducer(state, toggleSortRule({ field: "latency", isMulti: false }));
    expect(state.sortDirection).toBe("asc");
    expect(state.sortRules).toEqual([{ field: "latency", direction: "asc" }]);
  });

  it("handles multi-column sort toggle with Shift+Click", () => {
    let state = searchReducer(initial, setSort({ field: "service", direction: "asc" }));
    expect(state.sortRules).toEqual([{ field: "service", direction: "asc" }]);

    // Shift+Click latency adds secondary sort rule
    state = searchReducer(state, toggleSortRule({ field: "latency", isMulti: true }));
    expect(state.sortRules).toHaveLength(2);
    expect(state.sortRules[0]).toEqual({ field: "service", direction: "asc" });
    expect(state.sortRules[1]).toEqual({ field: "latency", direction: "desc" });

    // Shift+Click latency again toggles secondary sort rule to asc
    state = searchReducer(state, toggleSortRule({ field: "latency", isMulti: true }));
    expect(state.sortRules[1]).toEqual({ field: "latency", direction: "asc" });
  });

  it("resets all filters to initial defaults", () => {
    let state = searchReducer(initial, setSearchQuery("testing"));
    state = searchReducer(state, setSelectedStatus(404));
    state = searchReducer(state, setPage(8));
    state = searchReducer(state, resetFilters());

    expect(state.searchQuery).toBe("");
    expect(state.selectedStatus).toBeNull();
    expect(state.page).toBe(1);
    expect(state.sortField).toBe("timestamp");
    expect(state.sortDirection).toBe("desc");
  });
});

