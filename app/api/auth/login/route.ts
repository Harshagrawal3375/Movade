import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/repo";
import {
  setSessionCookie,
  createSessionToken,
  verifyPassword,
  serializeUser,
} from "@/lib/auth-server";
import { issueOtp } from "@/lib/otp-service";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Accounts created after OTP verification launched must verify first.
  // Legacy accounts (no flag) keep working.
  if (user.emailVerified === false) {
    try {
      const result = await issueOtp(user.email, "signup");
      return NextResponse.json(
        {
          error: "Please verify your email first — we sent you a fresh code.",
          code: "UNVERIFIED",
          devCode: result.devCode,
        },
        { status: 403 }
      );
    } catch {
      return NextResponse.json(
        {
          error: "Please verify your email first.",
          code: "UNVERIFIED",
        },
        { status: 403 }
      );
    }
  }

  setSessionCookie(createSessionToken(user.id));
  return NextResponse.json({ user: serializeUser(user) });
}
