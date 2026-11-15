import React from "react";
import type { Metadata } from "next";
import { AuthLayout, RegisterForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Create Account - DataScope Enterprise Workstation",
  description: "Register for DataScope's high-performance enterprise data discovery and intelligence platform.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Initialize your high-performance enterprise workspace"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

