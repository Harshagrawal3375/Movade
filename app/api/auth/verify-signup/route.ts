import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  findLatestOtp,
  incrementOtpAttempts,
  deleteOtp,
  markEmailVerified,
} from "@/lib/repo";
import { hashOtpCode, normalizeEmail, OTP_MAX_ATTEMPTS, isOtpExpired } from "@/lib/otp";
import {
  createSessionToken,
  setSessionCookie,
  serializeUser,
} from "@/lib/auth-server";

/** POST /api/auth/verify-signup { email, code } — completes signup. */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    code?: string;
  } | null;

  const email = body?.email ? normalizeEmail(body.email) : "";
  const code = body?.code?.trim() ?? "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "No signup found for this email." }, { status: 404 });
  }
  if (user.emailVerified ?? true) {
    // Already verified — just log them in flow-wise? Require password login.
    return NextResponse.json(
      { error: "This email is already verified. Please log in." },
      { status: 409 }
    );
  }

  const record = await findLatestOtp(email, "signup");
  if (!record) {
    return NextResponse.json(
      { error: "No code found. Please request a new one." },
      { status: 400 }
    );
  }
  if (isOtpExpired(record.expiresAt)) {
    await deleteOtp(record.id).catch(() => {});
    return NextResponse.json(
      { error: "This code has expired. Please request a new one." },
      { status: 400 }
    );
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await deleteOtp(record.id).catch(() => {});
    return NextResponse.json(
      { error: "Too many wrong attempts. Please request a new code." },
      { status: 429 }
    );
  }
  if (record.codeHash !== hashOtpCode(code)) {
    await incrementOtpAttempts(record.id).catch(() => {});
    return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 400 });
  }

  await deleteOtp(record.id).catch(() => {});
  await markEmailVerified(user.id);
  const updated = { ...user, emailVerified: true };

  setSessionCookie(createSessionToken(user.id));
  return NextResponse.json({ user: serializeUser(updated) });
}
