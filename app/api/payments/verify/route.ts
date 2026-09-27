import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore } from "@/lib/db";
import { getRazorpayClient } from "@/lib/razorpay";

/**
 * POST /api/payments/verify
 * { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Verifies the Razorpay signature (HMAC-SHA256 of order_id|payment_id
 * with the key secret). Only on a valid signature the booking flips
 * from "pending" → "confirmed". Never trust the client callback alone.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    bookingId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  } | null;

  if (
    !body?.bookingId?.trim() ||
    !body?.razorpay_order_id?.trim() ||
    !body?.razorpay_payment_id?.trim() ||
    !body?.razorpay_signature?.trim()
  ) {
    return NextResponse.json(
      { error: "bookingId, razorpay_order_id, razorpay_payment_id and razorpay_signature are required." },
      { status: 400 }
    );
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || keySecret.includes("your_")) {
    return NextResponse.json(
      { error: "Payment gateway is not configured yet." },
      { status: 503 }
    );
  }
  // Touch the client factory so misconfiguration fails fast here too.
  if (!getRazorpayClient()) {
    return NextResponse.json(
      { error: "Payment gateway is not configured yet." },
      { status: 503 }
    );
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(body.razorpay_signature, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
  }

  const store = await getStore();
  const booking = store.bookings.find((b) => b.id === body.bookingId!.trim());
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.razorpayOrderId && booking.razorpayOrderId !== body.razorpay_order_id) {
    return NextResponse.json(
      { error: "Order id does not match this booking." },
      { status: 400 }
    );
  }

  await updateStore((data) => {
    const b = data.bookings.find((x) => x.id === booking.id);
    if (b) {
      b.razorpayOrderId = body.razorpay_order_id!;
      b.razorpayPaymentId = body.razorpay_payment_id!;
      b.amountPaid = b.estimatedFare;
      b.paidAt = new Date().toISOString();
      b.status = "confirmed";
    }
  });

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    paymentId: body.razorpay_payment_id,
  });
}
