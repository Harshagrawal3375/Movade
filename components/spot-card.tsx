"use client";

import { useState } from "react";
import Image from "next/image";
import BookingModal, { BookingPayload } from "@/components/booking-modal";
import type { Spot } from "@/lib/types";

export default function SpotCard({ spot }: { spot: Spot }) {
  const [bookPayload, setBookPayload] = useState<BookingPayload | null>(null);

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white transition-shadow hover:shadow-floating">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={spot.image}
            alt={spot.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-text-primary backdrop-blur">
            {spot.tag}
          </span>
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <span className="text-accent-green">★</span>
            {spot.rating} ({spot.reviews})
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <h3 className="font-display text-lg font-bold text-text-primary">
            {spot.title}
          </h3>
          <p className="mt-1 text-sm text-text-muted">{spot.location}</p>
          <p className="mt-3 flex-1 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {spot.blurb}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
            {spot.showPrice && spot.price ? (
              <p className="font-display text-lg font-bold text-text-primary">
                {spot.price}
                <span className="text-xs font-normal text-text-muted">/session</span>
              </p>
            ) : (
              <span className="text-sm font-medium text-text-muted">
                Inquire for pricing
              </span>
            )}
            <button
              onClick={() =>
                setBookPayload({
                  packageTitle: spot.title,
                  packageType: "Experience",
                  destination: spot.location,
                })
              }
              aria-label={spot.showPrice ? `Book ${spot.title}` : `Inquire about ${spot.title}`}
              className="rounded-full bg-accent-green px-5 py-2.5 text-sm font-semibold text-text-primary transition-transform hover:scale-105 active:scale-95"
            >
              {spot.showPrice ? "Book now" : "Inquire"}
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        open={bookPayload !== null}
        onClose={() => setBookPayload(null)}
        payload={bookPayload}
      />
    </>
  );
}