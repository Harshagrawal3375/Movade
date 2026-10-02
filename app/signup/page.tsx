"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-white/60 px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30";

export default function SignupPage() {
  const { signup, verifySignup, resendSignupCode } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Verification step
  const [step, setStep] = useState<"details" | "verify">("details");
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Allow deep-linking from login's UNVERIFIED state: /signup?verify=email
  useEffect(() => {
    const v = searchParams.get("verify");
    if (v && /.+@.+\..+/.test(v)) {
      setPendingEmail(v.toLowerCase());
      setStep("verify");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Live password checks (type karte hi pata chale sahi hai ya nahi)
  const passwordOk = password.length >= 6;
  const confirmTouched = confirm.length > 0;
  const passwordsMatch = confirmTouched && passwordOk && password === confirm;
  const passwordsMismatch = confirmTouched && password !== confirm;
  const detailsInvalid =
    password.length < 6 || (confirmTouched && password !== confirm);

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
      const res = await signup(name.trim(), email.trim(), password);
      if (res.needVerification) {
        setPendingEmail(res.email);
        setDevCode(res.devCode);
        setStep("verify");
        setResendIn(45);
        if (res.otpFailed && res.error) {
          setError(`Account ban gaya, par email bhejne me dikkat aayi: ${res.error} Naya server restart ke baad "Resend code" dabao.`);
          showToast("Email bhejne me dikkat — Resend dabao.", "warning", "⚠️");
        } else {
          showToast(
            "We sent a 6-digit code to your email — enter it to verify.",
            "success",
            "📧"
          );
        }
      } else {
        showToast("Account created — welcome to Movade!", "success", "✨");
        router.push("/");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setVerifying(true);
    try {
      await verifySignup(pendingEmail, code.trim());
      showToast("Email verified — welcome to Movade!", "success", "🎉");
      router.push("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError("");
    try {
      const dc = await resendSignupCode(pendingEmail);
      setDevCode(dc);
      setResendIn(45);
      showToast("A fresh code is on its way.", "success", "📧");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-16">
      <div className="w-full max-w-md">
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
              {step === "details" ? "Create your account" : "Verify your email"}
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              {step === "details"
                ? "Join Movade and explore the world, one journey at a time."
                : `We sent a 6-digit code to ${pendingEmail}. Enter it below.`}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl border border-border-subtle p-8 shadow-floating"
        >
          {step === "details" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Full name
                </label>
                <input id="name" type="text" required autoComplete="name" value={name}
                  onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputCls} />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Real email address
                </label>
                <input id="email" type="email" required autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                <p className="mt-1 text-xs text-text-muted">
                  We&apos;ll send a verification code to this inbox.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Password
                  </label>
                  <div className="relative">
                    <input id="password" type={showPassword ? "text" : "password"} required
                      autoComplete="new-password" value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className={`${inputCls} pr-12`} />
                    <button type="button" onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted transition-colors hover:text-text-primary">
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <p className={`mt-1 text-xs font-medium ${passwordOk ? "text-green-600" : "text-red-500"}`}>
                      {passwordOk ? "✓ Password length OK (6+ characters)" : `✗ Too short — ${6 - password.length} more character(s) needed`}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input id="confirm" type={showConfirm ? "text" : "password"} required
                      autoComplete="new-password" value={confirm}
                      onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"
                      className={`${inputCls} pr-12 ${confirmTouched ? (passwordsMatch ? "border-green-500 focus:border-green-500 focus:ring-green-500/30" : "border-red-400 focus:border-red-400 focus:ring-red-400/30") : ""}`} />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted transition-colors hover:text-text-primary">
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {confirmTouched && (
                    <p className={`mt-1 text-xs font-medium ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                      {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button type="submit" disabled={submitting || detailsInvalid}
                title={detailsInvalid ? "Fix the password fields above first" : undefined}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? "Sending code…" : "Continue → Get code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              <div>
                <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-text-primary">
                  6-digit code
                </label>
                <input id="code" inputMode="numeric" autoComplete="one-time-code"
                  maxLength={6} value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`} />
                {devCode && (
                  <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                    Dev mode (email not configured): your code is <strong>{devCode}</strong>
                  </p>
                )}
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button type="submit" disabled={verifying}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                {verifying ? "Verifying…" : "Verify & create account"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep("details")}
                  className="font-medium text-text-muted transition-colors hover:text-text-primary">
                  ← Edit details
                </button>
                <button type="button" onClick={handleResend} disabled={resendIn > 0}
                  className="font-semibold text-text-primary underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50">
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-text-primary underline-offset-4 transition-colors hover:underline">
              Log in
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
