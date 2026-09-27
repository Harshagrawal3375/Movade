"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { getAuthErrorMessage } from "@/lib/firebase-errors";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      showToast("Welcome back!", "success", "👋");
      router.push("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Movade home">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12L3 4l3.5 8L3 20l18-8z"
                fill="#0B0F0D"
                stroke="#0B0F0D"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Movade
            </span>
          </Link>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Log in to start planning your next journey.
            </p>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl border border-border-subtle p-8 shadow-floating"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}