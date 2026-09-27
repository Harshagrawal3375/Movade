"use client";

import { useState } from "react";
import Image from "next/image";
import BookingModal, { BookingPayload } from "@/components/booking-modal";
import type { Property } from "@/lib/types";

export default function PropertyCard({ property }: { property: Property }) {
  const [bookPayload, setBookPayload] = useState<BookingPayload | null>(null);

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white transition-shadow hover:shadow-floating">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-text-primary backdrop-blur">
            {property.category}
          </span>
          {property.badge && (
            <span className="absolute right-3 top-3 rounded-full bg-accent-green px-3 py-1 text-[11px] font-semibold text-text-primary">
              {property.badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-text-primary">
              {property.name}
            </h3>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-text-primary">
              <span className="text-accent-green">★</span>
              {property.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            {property.city} · {property.location}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {property.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {property.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border-subtle px-2.5 py-1 text-[11px] font-medium text-text-muted"
              >
                {a}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
            <p className="font-display text-lg font-bold text-text-primary">
              ${property.pricePerNight}
              <span className="text-xs font-normal text-text-muted">/night</span>
            </p>
            <button
              onClick={() =>
                setBookPayload({
                  packageTitle: property.name,
                  packageType: property.category,
                  destination: `${property.city}, ${property.location}`,
                })
              }
              className="rounded-full bg-accent-green px-5 py-2.5 text-sm font-semibold text-text-primary transition-transform hover:scale-105 active:scale-95"
            >
              Book stay
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