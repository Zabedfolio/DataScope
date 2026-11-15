"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut as betterSignOut } from "@/lib/auth-client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and synchronize user session
  useEffect(() => {
    // 1. Check Better Auth active session
    if (sessionData?.user) {
      const authUser: UserProfile = {
        id: sessionData.user.id,
        name: sessionData.user.name || "Enterprise User",
        email: sessionData.user.email,
        role: (sessionData.user as { role?: string }).role || "Analyst",
        avatar: sessionData.user.image || undefined,
      };
      setUser(authUser);
      localStorage.setItem("datascope_user", JSON.stringify(authUser));
      setIsLoading(false);
      return;
    }

    // 2. Fallback to localStorage session
    try {
      const stored = localStorage.getItem("datascope_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [sessionData]);

  const login = useCallback((userData: UserProfile) => {
    setUser(userData);
    try {
      localStorage.setItem("datascope_user", JSON.stringify(userData));
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      localStorage.removeItem("datascope_user");
      await betterSignOut();
    } catch {
      // Ignore network error on logout
    }
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isPending || isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

