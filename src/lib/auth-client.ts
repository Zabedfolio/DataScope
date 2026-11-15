import { createAuthClient } from "better-auth/react";

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || typeof envUrl !== "string" || envUrl.trim() === "" || envUrl === "[REDACTED]") {
    return "http://localhost:5000";
  }
  let sanitized = envUrl.trim();
  // Ensure protocol is present
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

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
