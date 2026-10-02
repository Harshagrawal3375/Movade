"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30";

type Tab = "password" | "email";

export default function LoginPage() {
  const { login, sendLoginCode, verifyLoginCode, verifySignup } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [tab, setTab] = useState<Tab>("password");

  // Password tab
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email-code tab
  const [otpEmail, setOtpEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [devCode, setDevCode] = useState<string | undefined>();

  // Unverified-signup state (password login returned UNVERIFIED)
  const [needsSignupVerify, setNeedsSignupVerify] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [signupDevCode, setSignupDevCode] = useState<string | undefined>();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const resetOtp = () => {
    setCode("");
    setCodeSent(false);
    setDevCode(undefined);
    setError("");
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsSignupVerify("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      showToast("Welcome back!", "success", "👋");
      router.push("/");
    } catch (err) {
      const typed = err as Error & { code?: string; devCode?: string };
      if (typed.code === "UNVERIFIED") {
        setNeedsSignupVerify(email.trim().toLowerCase());
        setSignupDevCode(typed.devCode);
        setError("");
      } else {
        setError(getAuthErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const dc = await sendLoginCode(otpEmail.trim());
      setDevCode(dc);
      setCodeSent(true);
      setResendIn(45);
      showToast("Code sent to your email.", "success", "📧");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code.");
      return;
    }
    setSubmitting(true);
    try {
      await verifyLoginCode(otpEmail.trim(), code.trim());
      showToast("Welcome back!", "success", "👋");
      router.push("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifySignup(needsSignupVerify, signupCode.trim());
      showToast("Email verified — welcome!", "success", "🎉");
      router.push("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "password", label: "Password", icon: "🔑" },
    { id: "email", label: "Email code", icon: "📧" },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Movade home">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M21 12L3 4l3.5 8L3 20l18-8z" fill="#0B0F0D" stroke="#0B0F0D" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-2xl font-bold tracking-tight text-text-primary">Movade</span>
          </Link>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">Welcome back</h1>
            <p className="mt-2 text-sm text-text-muted">
              Log in with your password, or get a code by email.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl border border-border-subtle p-8 shadow-floating"
        >
          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-black/5 p-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setError(""); setNeedsSignupVerify(""); resetOtp(); }}
                className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-all ${
                  tab === t.id
                    ? "bg-white text-text-primary shadow"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {needsSignupVerify ? (
            <form onSubmit={handleVerifySignup} className="flex flex-col gap-5">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your email <strong>{needsSignupVerify}</strong> isn&apos;t verified yet.
                We sent a fresh code — enter it to finish signup.
              </div>
              <div>
                <label htmlFor="signup-code" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Verification code
                </label>
                <input id="signup-code" inputMode="numeric" maxLength={6} value={signupCode}
                  onChange={(e) => setSignupCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456" className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`} />
                {signupDevCode && (
                  <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                    Dev mode: your code is <strong>{signupDevCode}</strong>
                  </p>
                )}
              </div>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}
              <button type="submit" disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Verifying…" : "Verify & log in"}
              </button>
              <button type="button" onClick={() => setNeedsSignupVerify("")}
                className="text-sm font-medium text-text-muted hover:text-text-primary">
                ← Back to login
              </button>
            </form>
          ) : tab === "password" ? (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-primary">Email</label>
                <input id="email" type="email" required autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
                  <Link href="/forgot-password" className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} required
                    autoComplete="current-password" value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className={`${inputCls} pr-12`} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-text-primary">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}
              <button type="submit" disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Logging in…" : "Log in"}
              </button>
            </form>
          ) : !codeSent ? (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
              <div>
                <label htmlFor="otp-email" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Real email address
                </label>
                <input id="otp-email" type="email" required value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                <p className="mt-1 text-xs text-text-muted">We&apos;ll email you a 6-digit code.</p>
              </div>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}
              <button type="submit" disabled={submitting}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Sending…" : "Send email code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Code sent to <strong>{otpEmail.trim()}</strong>.{" "}
                <button type="button" onClick={resetOtp} className="font-semibold underline underline-offset-2">
                  Change
                </button>
              </p>
              <div>
                <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-text-primary">
                  6-digit code
                </label>
                <input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456" className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`} />
                {devCode && (
                  <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                    Dev mode (email not configured): your code is <strong>{devCode}</strong>
                  </p>
                )}
              </div>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}
              <button type="submit" disabled={submitting}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Verifying…" : "Verify & log in"}
              </button>
              <button type="button"
                onClick={async () => {
                  if (resendIn > 0) return;
                  setError("");
                  try {
                    const dc = await sendLoginCode(otpEmail.trim());
                    setDevCode(dc);
                    setResendIn(45);
                  } catch (err) {
                    setError(getAuthErrorMessage(err));
                  }
                }}
                disabled={resendIn > 0}
                className="text-sm font-semibold text-text-primary underline-offset-4 hover:underline disabled:opacity-50">
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-text-primary underline-offset-4 transition-colors hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
