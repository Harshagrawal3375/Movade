import { NextRequest, NextResponse } from "next/server";
import {
  createPasswordReset,
  deleteExpiredPasswordResets,
  deletePasswordResetsForUser,
  findUserByEmail,
  newId,
} from "@/lib/repo";
import { RESET_TOKEN_TTL_MS, createResetToken } from "@/lib/auth-server";
import { sendPasswordResetEmail } from "@/lib/mailer";

/**
 * POST /api/auth/forgot-password { email }
 * Always returns { ok: true } so attackers can't enumerate accounts.
 * Sends the reset link via SMTP when configured (see lib/mailer.ts);
 * otherwise the link is logged and — in non-production only — returned
 * as `resetUrl` so the flow can be tested without SMTP.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await deleteExpiredPasswordResets().catch(() => {});
  } catch {
    // best-effort pruning; never block the request
  }

  const user = await findUserByEmail(email);

  if (user) {
    // Single active token per user: invalidate older ones first.
    await deletePasswordResetsForUser(user.id).catch(() => {});

    const { token, tokenHash } = createResetToken();
    const now = new Date();
    await createPasswordReset({
      id: newId("pwreset"),
      userId: user.id,
      email: user.email,
      tokenHash,
      expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS).toISOString(),
      createdAt: now.toISOString(),
    });

    const resetUrl = `${request.nextUrl.origin}/reset-password?token=${token}`;

    try {
      const emailed = await sendPasswordResetEmail(user.email, resetUrl);
      if (!emailed && process.env.NODE_ENV !== "production") {
        // No SMTP configured locally — return the link so dev can test.
        console.log(`[auth] SMTP not configured; reset link for ${user.email}: ${resetUrl}`);
        return NextResponse.json({ ok: true, resetUrl });
      }
      if (!emailed) {
        console.warn(`[auth] SMTP not configured; password reset requested for ${user.email}`);
      }
    } catch (err) {
      // Never reveal mail failures to the client (prevents enumeration).
      console.error("[auth] failed to send reset email:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
