"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { getAuthErrorMessage } from "@/lib/firebase-errors";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      showToast("Account created — welcome to Movade!", "success", "✨");
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Join Movade and explore the world, one journey at a time.
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
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30"
              />
            </div>

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30"
                />
              </div>
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
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-text-primary underline-offset-4 transition-colors hover:underline"
            >
              Log in
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