import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/repo";
import { normalizeEmail } from "@/lib/otp";
import { issueOtp } from "@/lib/otp-service";

/** POST /api/auth/resend-signup-code { email } */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = body?.email ? normalizeEmail(body.email) : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "No signup found for this email." }, { status: 404 });
  }
  if (user.emailVerified ?? true) {
    return NextResponse.json(
      { error: "This email is already verified. Please log in." },
      { status: 409 }
    );
  }
  try {
    const result = await issueOtp(email, "signup");
    return NextResponse.json({ ok: true, devCode: result.devCode });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not send code." },
      { status: 429 }
    );
  }
}
