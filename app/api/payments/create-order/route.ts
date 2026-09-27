import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore } from "@/lib/db";
import { getPublicKeyId, getRazorpayClient, toPaise } from "@/lib/razorpay";

/**
 * POST /api/payments/create-order { bookingId }
 * Creates a Razorpay order for a PENDING booking and stores the
 * order id on it. Frontend opens Razorpay Checkout with the
 * returned order_id + public key.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    bookingId?: string;
  } | null;

  if (!body?.bookingId?.trim()) {
    return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
  }

  const razorpay = getRazorpayClient();
  const publicKeyId = getPublicKeyId();
  if (!razorpay || !publicKeyId) {
    return NextResponse.json(
      {
        error:
          "Payment gateway is not configured yet. Add Razorpay test keys to .env.local (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID) and restart the dev server.",
      },
      { status: 503 }
    );
  }

  const store = await getStore();
  const booking = store.bookings.find((b) => b.id === body.bookingId!.trim());
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (booking.status === "confirmed") {
    return NextResponse.json({ error: "This booking is already paid." }, { status: 409 });
  }

  const amount = booking.estimatedFare && booking.estimatedFare > 0
    ? booking.estimatedFare
    : 100;
  const amountPaise = toPaise(amount);

  try {
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: booking.id,
      notes: {
        bookingId: booking.id,
        destination: booking.destination,
        guests: String(booking.guests),
      },
    });

    await updateStore((data) => {
      const b = data.bookings.find((x) => x.id === booking.id);
      if (b) b.razorpayOrderId = order.id;
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      keyId: publicKeyId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not create payment order: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
