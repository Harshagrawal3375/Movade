import { NextRequest, NextResponse } from "next/server";
import {
  findLatestOtp,
  findUserByEmail,
  incrementOtpAttempts,
  deleteOtp,
  markEmailVerified,
} from "@/lib/repo";
import {
  hashOtpCode,
  normalizeEmail,
  OTP_MAX_ATTEMPTS,
  isOtpExpired,
} from "@/lib/otp";
import {
  createSessionToken,
  setSessionCookie,
  serializeUser,
} from "@/lib/auth-server";

/**
 * POST /api/auth/verify-login-code { email, code }
 * Verifies an email login OTP and creates a session.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    code?: string;
  } | null;

  const rawEmail = body?.email?.trim() ?? "";
  const code = body?.code?.trim() ?? "";

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }
  if (!rawEmail) {
    return NextResponse.json(
      { error: "Please enter your email address." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(rawEmail);
  const record = await findLatestOtp(email, "login");
  if (!record || isOtpExpired(record.expiresAt)) {
    if (record) await deleteOtp(record.id).catch(() => {});
    return NextResponse.json(
      { error: "This code is invalid or has expired. Request a new one." },
      { status: 400 }
    );
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await deleteOtp(record.id).catch(() => {});
    return NextResponse.json(
      { error: "Too many wrong attempts. Request a new code." },
      { status: 429 }
    );
  }
  if (record.codeHash !== hashOtpCode(code)) {
    await incrementOtpAttempts(record.id).catch(() => {});
    return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    // The send route intentionally stays vague; bail here.
    await deleteOtp(record.id).catch(() => {});
    return NextResponse.json(
      { error: "No account found for this email. Please sign up first." },
      { status: 404 }
    );
  }
  await deleteOtp(record.id).catch(() => {});
  if (!(user.emailVerified ?? true)) await markEmailVerified(user.id);
  setSessionCookie(createSessionToken(user.id));
  return NextResponse.json({
    user: serializeUser({ ...user, emailVerified: true }),
  });
}
