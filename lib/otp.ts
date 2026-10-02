import { createHash, randomInt } from "node:crypto";

/** OTP codes are 6 digits, valid for 10 minutes, max 5 attempts. */
export const OTP_TTL_MS = 1000 * 60 * 10;
export const OTP_MAX_ATTEMPTS = 5;
/** Throttle: at most one code per 45s + 5 per hour per identifier. */
export const OTP_RESEND_MS = 45 * 1000;
export const OTP_HOURLY_LIMIT = 5;

export function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

export function hashOtpCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isOtpExpired(expiresAt: string): boolean {
  return expiresAt < new Date().toISOString();
}
