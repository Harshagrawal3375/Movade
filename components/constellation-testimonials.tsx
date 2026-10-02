"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Mono } from "next/font/google";
import clsx from "clsx";
import TestimonialForm from "@/components/testimonial-form";
import ReviewSection from "@/components/review-section";

const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

const CONSTELLATION_LIMIT = 20;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  photo: string;
  x: number;
  y: number;
  objectPos: string;
  duration: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Arman Kabir",
    role: "Solo Explorer · Goa",
    quote:
      "Movade turned a vague idea of “somewhere warm” into the best two weeks of my year.",
    photo: "/review/20303b5f6f2cf43506bb6d88e4ad0d93.jpg",
    x: -330,
    y: -110,
    objectPos: "50% 14%",
    duration: 7,
  },
  {
    id: 2,
    name: "Rafiul Hasan",
    role: "Verified Traveler · Jaipur",
    quote:
      "Every detail was planned so well I never once opened Google Maps in Jaipur.",
    photo: "/review/355ed0f15a82c42abe7e51bba1d34606.jpg",
    x: -110,
    y: -170,
    objectPos: "50% 16%",
    duration: 8,
  },
  {
    id: 3,
    name: "Imran Chowdhury",
    role: "Family Trip · Pondicherry",
    quote:
      "Traveling with kids is stressful — Movade's team handled everything so we didn't have to.",
    photo: "/review/39202174545c29bfbdb0bb981ed6e766.jpg",
    x: 150,
    y: -155,
    objectPos: "50% 14%",
    duration: 6.5,
  },
  {
    id: 4,
    name: "Tahsin Ahmed",
    role: "Honeymoon · Andaman",
    quote:
      "The sunset dinner they arranged on Radhanagar is a memory we'll keep for life.",
    photo: "/review/3e62508b466da1db86ac9ba0dd940490.jpg",
    x: 350,
    y: -75,
    objectPos: "50% 15%",
    duration: 7.5,
  },
  {
    id: 5,
    name: "Sabbir Rahman",
    role: "Business Traveler · Mumbai",
    quote:
      "Fast rebooking when my flight changed last minute. Genuinely felt taken care of.",
    photo: "/review/785ca2f82448ff5b842b12e56cc1b393.jpg",
    x: -370,
    y: 80,
    objectPos: "50% 13%",
    duration: 6,
  },
  {
    id: 6,
    name: "Nabil Hossain",
    role: "Adventure Seeker · Meghalaya",
    quote:
      "They found a hiking route no other agency mentioned. Absolute hidden gem.",
    photo: "/review/a583c395a9133f31190311989d79caa9.jpg",
    x: -90,
    y: 210,
    objectPos: "50% 16%",
    duration: 8.5,
  },
  {
    id: 7,
    name: "Fahim Islam",
    role: "Return Client · Konkan Coast",
    quote:
      "Third trip booked with Movade and it keeps getting better. Never going elsewhere.",
    photo: "/review/b6ec85be9c5a41cd707f80aa5995c7b6.jpg",
    x: 170,
    y: 190,
    objectPos: "50% 14%",
    duration: 7,
  },
  {
    id: 8,
    name: "Zayan Karim",
    role: "Weekend Getaway · Manali",
    quote:
      "Even a short weekend trip felt curated and effortless from start to finish.",
    photo: "/review/e293a27e36a2757509b589c23943616c.jpg",
    x: 390,
    y: 70,
    objectPos: "50% 15%",
    duration: 6.8,
  },
];

export default function ConstellationTestimonials() {
  const [list, setList] = useState<Testimonial[]>(TESTIMONIALS);
  const [activeId, setActiveId] = useState(TESTIMONIALS[0].id);
  const [shareOpen, setShareOpen] = useState(false);
  const active = list.find((t) => t.id === activeId) ?? list[0];
  const showList = list.length > CONSTELLATION_LIMIT;

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = (await res.json()) as { testimonials: Testimonial[] };
      setList(data.testimonials);
      if (!data.testimonials.some((t) => t.id === activeId)) {
        setActiveId(data.testimonials[0]?.id ?? 1);
      }
    } catch {
      // keep existing list on network failure
    }
  }, [activeId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <section className="relative overflow-hidden border-t border-border-subtle bg-bg-primary px-6 py-14 md:px-10 md:py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(182,255,60,0.12) 0%, rgba(182,255,60,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <span
          className={`${mono.className} inline-flex items-center gap-2 rounded-full border border-accent-green/40 bg-accent-green/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-text-primary`}
        >
          <span className="text-accent-green">✦</span>
          Testimonials
        </span>
        <h2 className="mt-5 font-display text-4xl font-bold text-text-primary md:text-5xl">
          Testimonials
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
          {showList
            ? "Real journeys, real words — read every story shared by travelers who booked with us."
            : "Real journeys, real words — hover or tap a traveler in the constellation to read their story."}
        </p>
        <button
          onClick={() => setShareOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-text-primary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-white"
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
      </div>

      {showList ? (
        <ReviewSection reviews={list} onShare={() => setShareOpen(true)} />
      ) : (
        <>
          {/* Desktop constellation canvas */}
      <div className="relative mx-auto mt-10 hidden h-[480px] max-w-5xl md:block">
        {/* central hub */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-floating">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.32-3.87-.9L4 20l1.02-4.5A8.47 8.47 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"
                  stroke="#0B0F0D"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {list.map((t) => (
          <div
            key={t.id}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.button
              type="button"
              onMouseEnter={() => setActiveId(t.id)}
              onClick={() => setActiveId(t.id)}
              initial={{ x: t.x, y: t.y }}
              animate={
                activeId === t.id
                  ? { x: t.x, y: t.y, rotate: 0 }
                  : {
                      x: [t.x, t.x + 10, t.x - 8, t.x + 6, t.x],
                      y: [t.y, t.y - 12, t.y + 8, t.y - 6, t.y],
                      rotate: [0, 2, -2, 1, 0],
                    }
              }
              transition={
                activeId === t.id
                  ? { duration: 0, ease: "easeOut" }
                  : {
                      duration: t.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <span
                className={clsx(
                  "relative flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white p-0.5 shadow-lg transition-all duration-300",
                  activeId === t.id
                    ? "border-accent-green shadow-[0_0_0_6px_rgba(182,255,60,0.25)]"
                    : "border-white/80 hover:border-accent-green/60"
                )}
              >
                <span className="relative block h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    sizes="64px"
                    style={{ objectPosition: t.objectPos }}
                    className="object-cover"
                  />
                </span>
              </span>
            </motion.button>
          </div>
        ))}

        <div
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
          style={{ transform: `translate(calc(-50% + ${active.x}px), calc(-50% + ${active.y}px))` }}
        >
        <div className="absolute bottom-[38px] left-1/2 z-30 w-72 -translate-x-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="glass relative rounded-3xl border border-white/50 p-5 shadow-floating">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="mb-2 text-accent-green">
                  <path
                    d="M5.5 3.5C3.5 4.5 2.5 6 2.5 8c0 1.4 1 2.5 2.3 2.5S7 9.4 7 8c0-1.1-.7-2-1.7-2.2.2-.9.9-1.7 2-2.2L5.5 3.5Zm6 0C9.5 4.5 8.5 6 8.5 8c0 1.4 1 2.5 2.3 2.5S13 9.4 13 8c0-1.1-.7-2-1.7-2.2.2-.9.9-1.7 2-2.2L11.5 3.5Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="font-display text-base font-bold text-text-primary">
                  {active.name}
                </p>
                <p className={`${mono.className} mt-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-green`}>
                  {active.role}
                </p>
                <p className="mt-3 text-sm italic leading-relaxed text-text-muted">
                  {active.quote}
                </p>
                <span className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/50 bg-white/85" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </div>

      {/* Mobile fallback: simple horizontal carousel */}
      <div className="mt-12 flex gap-4 overflow-x-auto pb-4 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((t) => (
          <div
            key={t.id}
            className="w-[260px] shrink-0 rounded-3xl border border-border-subtle bg-white p-5 shadow-floating"
          >
            <div className="flex items-center gap-3">
              <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-accent-green">
                <Image
                  src={t.photo}
                  alt={t.name}
                  fill
                  sizes="48px"
                  style={{ objectPosition: t.objectPos }}
                  className="object-cover"
                />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-text-primary">
                  {t.name}
                </p>
                <p className={`${mono.className} text-[10px] font-bold uppercase tracking-wide text-accent-green`}>
                  {t.role}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm italic leading-relaxed text-text-muted">
              {t.quote}
            </p>
          </div>
        ))}
      </div>
        </>
      )}

      <TestimonialForm
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onCreated={reload}
      />
    </section>
  );
}
