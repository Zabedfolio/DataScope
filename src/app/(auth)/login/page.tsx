import React from "react";
import type { Metadata } from "next";
import { AuthLayout, LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Sign In - DataScope Enterprise Workstation",
  description: "Secure credential authentication to DataScope's data discovery and intelligence platform.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DataScope enterprise workstation"
    >
      <LoginForm />
    </AuthLayout>
  );
}

