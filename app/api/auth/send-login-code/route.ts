import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/repo";
import { normalizeEmail } from "@/lib/otp";
import { issueOtp } from "@/lib/otp-service";

/**
 * POST /api/auth/send-login-code { email }
 * Sends a one-time login code to the REAL inbox.
 * Passwordless alternative to /api/auth/login.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;

  const rawEmail = body?.email?.trim() ?? "";
  if (!rawEmail) {
    return NextResponse.json(
      { error: "Please enter your email address." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(rawEmail);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const user = await findUserByEmail(email);
    // Don't reveal whether the account exists (prevents enumeration).
    if (user) {
      const result = await issueOtp(email, "login");
      return NextResponse.json({ ok: true, devCode: result.devCode });
    }
    // Still throttle even for unknown emails to avoid probing.
    await issueOtp(`unknown:${email}`, "login").catch(() => null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not send code." },
      { status: 429 }
    );
  }
}
