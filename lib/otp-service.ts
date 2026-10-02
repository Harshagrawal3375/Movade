import { newId, saveOtp, listRecentOtps, deleteExpiredOtps } from "@/lib/repo";
import {
  OTP_TTL_MS,
  OTP_HOURLY_LIMIT,
  OTP_RESEND_MS,
  generateOtpCode,
  hashOtpCode,
} from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";
import type { OtpCode } from "@/lib/types";

interface IssueResult {
  ok: true;
  /** Present only in non-production when SMTP isn't configured. */
  devCode?: string;
}

/**
 * Throttle + create + deliver an email OTP. Throws Error with user-facing
 * message on rate limits; returns devCode when SMTP isn't configured
 * (dev only).
 */
export async function issueOtp(
  email: string,
  purpose: OtpCode["purpose"]
): Promise<IssueResult> {
  await deleteExpiredOtps().catch(() => {});

  const now = Date.now();
  const oneHourAgo = new Date(now - 3600 * 1000).toISOString();
  const recent = await listRecentOtps(email, oneHourAgo);
  const latest = recent.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

  if (
    latest &&
    now - new Date(latest.createdAt).getTime() < OTP_RESEND_MS
  ) {
    const wait = Math.ceil(
      (OTP_RESEND_MS - (now - new Date(latest.createdAt).getTime())) / 1000
    );
    throw new Error(`Please wait ${wait}s before requesting a new code.`);
  }
  if (recent.length >= OTP_HOURLY_LIMIT) {
    throw new Error("Too many codes requested. Please try again in an hour.");
  }

  const code = generateOtpCode();
  const stamp = new Date().toISOString();
  await saveOtp({
    id: newId("otp"),
    identifier: email,
    channel: "email",
    codeHash: hashOtpCode(code),
    purpose,
    attempts: 0,
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    createdAt: stamp,
  });

  let delivered = false;
  try {
    delivered = await sendOtpEmail(email, code);
  } catch (err) {
    console.error("[otp] failed to deliver email code:", err);
    throw new Error("Could not send the email. Check SMTP settings and try again.");
  }

  if (!delivered) {
    console.log(`[otp] email not configured; code for ${email}: ${code}`);
    if (process.env.NODE_ENV !== "production") {
      return { ok: true, devCode: code };
    }
    throw new Error("Email sending is not configured on the server. Contact support.");
  }

  return { ok: true };
}
