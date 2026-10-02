import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, newId } from "@/lib/repo";
import { hashPassword } from "@/lib/auth-server";
import { normalizeEmail } from "@/lib/otp";
import { issueOtp } from "@/lib/otp-service";
import type { User } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/signup { name, email, password }
 * Creates an UNVERIFIED account and sends a 6-digit code to the real
 * inbox (SMTP/Gmail). Client then calls /api/auth/verify-signup.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;

  const name = body?.name?.trim();
  const email = body?.email ? normalizeEmail(body.email) : "";
  const password = body?.password ?? "";

  if (!name) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password should be at least 6 characters." },
      { status: 400 }
    );
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    // Already verified → normal duplicate error.
    if (existing.emailVerified ?? true) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }
    // Unverified → resend the code instead of creating a duplicate.
    try {
      const result = await issueOtp(email, "signup");
      return NextResponse.json(
        {
          needVerification: true,
          email,
          resent: true,
          devCode: result.devCode,
        },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Could not send code." },
        { status: 429 }
      );
    }
  }

  const { salt, hash } = hashPassword(password);
  const user: User = {
    id: newId("u"),
    name,
    email,
    passwordHash: hash,
    salt,
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date().toISOString(),
  };
  try {
    await createUser(user);
  } catch {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  try {
    const emailResult = await issueOtp(email, "signup");
    return NextResponse.json(
      {
        needVerification: true,
        email,
        devCode: emailResult.devCode,
      },
      { status: 201 }
    );
  } catch (err) {
    // Account exists but the email failed (bad SMTP, network, throttling).
    // Surface it so the UI can show a resend option instead of failing silently.
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Account created but the verification email failed. Tap resend to try again.",
        needVerification: true,
        email,
        otpFailed: true,
      },
      { status: 201 }
    );
  }
}
