import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Booking Confirmed — Movade",
  robots: { index: false },
};

export default function BookingConfirmedPage({
  searchParams,
}: {
  searchParams?: { booking?: string; payment?: string };
}) {
  const bookingId = searchParams?.booking;
  const paymentId = searchParams?.payment;
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 pt-24 pb-24">
        <div className="w-full max-w-lg rounded-3xl border border-border-subtle bg-white p-8 text-center shadow-floating md:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-green">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5L9.5 17L19 7.5"
                stroke="#0B0F0D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold text-text-primary">
            {paymentId ? "Payment successful!" : "Booking request received!"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {paymentId
              ? "Your payment went through and your booking is confirmed. Our team will email your itinerary and next steps shortly."
              : "Thanks for booking with Movade. Our team is reviewing your request and will confirm availability within one business day — you'll receive an email with your itinerary and next steps."}
          </p>
          {(bookingId || paymentId) && (
            <dl className="mt-6 space-y-2 rounded-2xl border border-border-subtle bg-neutral-50 p-4 text-left text-sm">
              {bookingId && (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-text-muted">Booking ID</dt>
                  <dd className="font-mono font-medium text-text-primary">{bookingId}</dd>
                </div>
              )}
              {paymentId && (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-text-muted">Payment ID</dt>
                  <dd className="font-mono font-medium text-text-primary">{paymentId}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform hover:scale-[1.01]"
            >
              Back to home
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Need to change something? Contact us →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}