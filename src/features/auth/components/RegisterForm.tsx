"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { useAuth } from "@/features/auth/context/AuthContext";

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Viewer" | "Analyst">("Analyst");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Password Strength Calculations
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0 to 4
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: "None", color: "bg-slate-200 dark:bg-slate-700", width: "w-0" };
    if (passwordStrength <= 1) return { text: "Weak", color: "bg-rose-500", width: "w-1/4" };
    if (passwordStrength <= 2) return { text: "Fair", color: "bg-amber-500", width: "w-2/4" };
    if (passwordStrength === 3) return { text: "Good", color: "bg-cyan-500", width: "w-3/4" };
    return { text: "Strong", color: "bg-[#00D69A]", width: "w-full" };
  }, [password, passwordStrength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    if (passwordStrength < 2) {
      setErrorMessage("Please choose a stronger password (minimum 8 characters with numbers or symbols).");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to continue.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const userData = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
    };

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to create account. Email may already be in use.");
      } else {
        login(userData);
        router.push("/dashboard");
      }
    } catch {
      // Offline fallback: log into client session
      login(userData);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-xl text-xs font-mono bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 flex items-start gap-2.5 animate-in fade-in duration-200"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor="reg-name"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
        >
          Full Name
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zabed Mahmud"
          className="w-full px-3.5 py-2 text-sm font-sans rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#051114] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
        />
      </div>

      {/* Work Email Input */}
      <div>
        <label
          htmlFor="reg-email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
        >
          Work Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@enterprise.io"
          className="w-full px-3.5 py-2 text-sm font-sans rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#051114] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
        />
      </div>

      {/* Password Input + Strength Meter */}
      <div>
        <label
          htmlFor="reg-password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
        >
          Master Key Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full pl-3.5 pr-10 py-2 text-sm font-sans rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#051114] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D69A] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Strength Progress Bar */}
        {password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-500">
              <span>Entropy: {strengthLabel.text}</span>
              <span>{passwordStrength * 25}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strengthLabel.color} ${strengthLabel.width}`} />
            </div>
          </div>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Workspace Role
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("Analyst")}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              role === "Analyst"
                ? "border-[#00D69A] bg-[#00D69A]/10 text-slate-900 dark:text-white"
                : "border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <div className="text-xs font-bold font-mono text-[#008A64] dark:text-[#00D69A]">Analyst (Recommended)</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Query &amp; export data streams</div>
          </button>

          <button
            type="button"
            onClick={() => setRole("Viewer")}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              role === "Viewer"
                ? "border-[#00D69A] bg-[#00D69A]/10 text-slate-900 dark:text-white"
                : "border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <div className="text-xs font-bold font-mono">Viewer</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Read-only dashboard view</div>
          </button>
        </div>
      </div>

      {/* Terms Agreement Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
          <input
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-[#00D69A] focus:ring-[#00D69A]"
          />
          <span>
            I agree to the DataScope Enterprise Terms of Service and Privacy Policy.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#00D69A] hover:bg-[#00BF89] text-slate-950 shadow-md shadow-[#00D69A]/20 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Creating Secure Credentials...</span>
          </>
        ) : (
          <span>Initialize Enterprise Account &rarr;</span>
        )}
      </button>

      {/* Sign In Link */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
        Already have credentials?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#008A64] dark:text-[#00D69A] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}

