"use client";

import Image from "next/image";
import { Space_Mono } from "next/font/google";
import clsx from "clsx";
import type { Testimonial } from "@/lib/types";

const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

function starsFor(t: Testimonial) {
  return t.id % 9 === 0 ? 4 : 5;
}

function StarRow({ count, size = 15 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i <= count ? "#F59E0B" : "#E2E8F0"}
        >
          <path d="M10 1.4l2.7 5.4 6 .9-4.3 4.2 1 6L10 15.4l-5.4 2.5 1-6L1.3 7.7l6-.9L10 1.4z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewSection({
  reviews,
  onShare,
}: {
  reviews: Testimonial[];
  onShare: () => void;
}) {
  const total = reviews.length;
  const sum = reviews.reduce((acc, t) => acc + starsFor(t), 0);
  const average = total ? sum / total : 0;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((t) => starsFor(t) === stars).length,
  }));

  return (
    <div className="relative mx-auto mt-10 max-w-4xl">
      {/* Summary */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border-subtle bg-white p-6 shadow-floating sm:flex-row sm:items-center sm:gap-10">
        <div className="shrink-0 text-center sm:text-left">
          <p className="font-display text-5xl font-bold text-text-primary">
            {average.toFixed(1)}
          </p>
          <div className="mt-2 flex justify-center sm:justify-start">
            <StarRow count={Math.round(average)} size={18} />
          </div>
          <p className="mt-2 text-xs text-text-muted">
            {total} verified traveler {total === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="w-full flex-1 space-y-1.5">
          {breakdown.map((d) => {
            const pct = total ? (d.count / total) * 100 : 0;
            return (
              <div key={d.stars} className="flex items-center gap-2.5">
                <span className="w-3 text-right text-xs text-text-muted">{d.stars}</span>
                <span className="relative h-[7px] flex-1 overflow-hidden rounded-full bg-border-subtle">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-7 text-xs tabular-nums text-text-muted">{d.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* All reviews */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/80">
                <Image
                  src={t.photo}
                  alt={t.name}
                  fill
                  sizes="44px"
                  style={{ objectPosition: t.objectPos }}
                  className="object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-text-primary">
                  {t.name}
                </p>
                <p
                  className={clsx(
                    mono.className,
                    "mt-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-green"
                  )}
                >
                  {t.role}
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent-green/10 px-2 py-1 text-[10px] font-bold text-text-primary">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm-.6 9.4L4.5 8l1.1-1.1 1.8 1.8 3.5-3.5L12 6.3l-4.6 4.6Z"
                    fill="currentColor"
                  />
                </svg>
                Verified
              </span>
            </div>

            <div className="mt-3">
              <StarRow count={starsFor(t)} />
            </div>

            <p className="mt-2 text-sm leading-relaxed text-text-muted">{t.quote}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onShare}
          className="inline-flex items-center gap-2 rounded-full bg-accent-green px-5 py-2.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 10.5V2.5m0 0L5.5 5M8 2.5L10.5 5M4 9v3.5h8V9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Share your experience
        </button>
        <p className="mt-3 text-xs text-text-muted">
          Showing all {total} reviews
        </p>
      </div>
    </div>
  );
}