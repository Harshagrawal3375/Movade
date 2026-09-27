import Razorpay from "razorpay";

/**
 * Server-side Razorpay client.
 * Returns null when keys are not configured so API routes can
 * respond with a clear "gateway not configured" message instead
 * of crashing — keys are added later via .env.local.
 */
export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || keyId.includes("your_") || keySecret.includes("your_")) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function getPublicKeyId(): string | null {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId || keyId.includes("your_")) return null;
  return keyId;
}

/** Rupees → paise (Razorpay expects the smallest currency unit). */
export function toPaise(rupees: number): number {
  return Math.max(100, Math.round(rupees * 100));
}
