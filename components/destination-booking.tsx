"use client";

import { useState } from "react";
import BookingModal, { BookingPayload } from "@/components/booking-modal";
import MagneticButton from "@/components/ui/magnetic-button";

export default function DestinationBooking({
  title,
  destination,
}: {
  title: string;
  destination: string;
}) {
  const [bookPayload, setBookPayload] = useState<BookingPayload | null>(null);

  return (
    <>
      <MagneticButton
        onClick={() =>
          setBookPayload({
            packageTitle: `${title} Package`,
            packageType: "Destination",
            destination,
          })
        }
        className="w-full bg-accent-green px-8 py-4 text-sm font-semibold text-text-primary md:w-auto"
      >
        Book this trip
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 7H13M13 7L8 2M13 7L8 12"
            stroke="#0B0F0D"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MagneticButton>

      <BookingModal
        open={bookPayload !== null}
        onClose={() => setBookPayload(null)}
        payload={bookPayload}
      />
    </>
  );
}