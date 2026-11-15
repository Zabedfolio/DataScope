import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || typeof envUrl !== "string" || envUrl.trim() === "" || envUrl === "[REDACTED]") {
    return "http://localhost:5000";
  }
  let sanitized = envUrl.trim();
  if (!sanitized.startsWith("http://") && !sanitized.startsWith("https://")) {
    sanitized = `https://${sanitized}`;
  }
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    return "http://localhost:5000";
  }
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Datasets", "Records", "Views"],
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include",
  }),
  endpoints: () => ({}),
});
