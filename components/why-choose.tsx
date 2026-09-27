"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import Reveal from "@/components/ui/reveal";
import TiltCard from "@/components/ui/tilt-card";

const STATS = [
  { value: 12, suffix: "k", label: "Happy and Satisfied Travelers" },
  { value: 10, suffix: "yrs", label: "Proven Travel Industry Experience" },
  { value: 50, suffix: "+", label: "Destinations Covered" },
];

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 3 6.5V11c0 5.2 3.6 9.9 9 11 5.4-1.1 9-5.8 9-11V6.5L12 2Z"
          stroke="#0B0F0D"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Local Expertise",
    text: "Our team knows every destination personally, so you get insider routes and hidden gems, not just a checklist.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="15" rx="2" stroke="#0B0F0D" strokeWidth="1.6" />
        <path d="M3 9.5h18M8 3v4M16 3v4" stroke="#0B0F0D" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "All-in-One Booking",
    text: "Flights, stays, and experiences handled in a single itinerary — no juggling ten different confirmations.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 13a8 8 0 0 1 16 0M4 13v4a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1Zm16 0v4a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1Z"
          stroke="#0B0F0D"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "24/7 Support",
    text: "Real people, reachable any time of day if your plans change or you just need a quick answer on the road.",
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 8.5h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.2l.8-3H13V9c0-.3.2-.5.5-.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 5.5c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.7-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.6A11.3 11.3 0 0 1 2.9 4.3a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.1-1.2.2-1.8.1a4 4 0 0 0 3.7 2.7A8 8 0 0 1 2 17.4a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6.1 11.3-11.3v-.5c.8-.6 1.4-1.3 1.9-2.1Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function WhyChoose() {
  const statRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const { value, suffix } = STATS[i];
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.n)}${suffix}`;
          },
        });
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-choose"
      className="relative overflow-hidden bg-white px-6 py-24 md:px-10 md:py-32"
    >
      {/* Decorative background: soft accent glow + dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent-green/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(11,15,13,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_20%,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
        <Reveal>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-primary shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Why Movade
          </div>

          <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance md:text-4xl lg:text-[3rem]">
            Why Thousands of Travelers Choose{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-accent-green to-[#7FE000] bg-clip-text text-transparent">
                Movade
              </span>
              <svg
                aria-hidden
                viewBox="0 0 180 18"
                className="absolute -bottom-1 left-0 h-3 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 13C40 4 140 4 178 13"
                  stroke="#B6FF3C"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.55"
                />
              </svg>
            </span>{" "}
            for Their Next Adventure
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-muted md:text-base">
            From pristine beaches to cultural hotspots, we make exploring the
            world easier, safer, and more exciting with expert-crafted
            itineraries and round-the-clock support.
          </p>

          <div className="mt-7 flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-text-primary hover:bg-text-primary hover:text-white hover:shadow-floating"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="relative mt-11 grid grid-cols-3 gap-6 pt-9">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent"
            />
            {STATS.map((stat, i) => (
              <div key={stat.label} className="relative">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute -left-3 top-1 hidden h-9 w-px bg-black/10 sm:block"
                  />
                )}
                <p
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  className="font-display text-3xl font-bold tabular-nums text-text-primary md:text-4xl"
                >
                  0{stat.suffix}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-text-muted md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="relative flex flex-col gap-4">
          <div
            aria-hidden
            className="absolute left-[27px] top-6 bottom-6 hidden w-px bg-gradient-to-b from-accent-green/60 via-border-subtle to-transparent sm:block"
          />
          {FEATURES.map((feature, i) => (
            <TiltCard
              key={feature.title}
              max={4}
              className="group relative"
            >
              <div
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="relative flex items-start gap-4 overflow-hidden rounded-3xl border border-border-subtle bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent-green/60 group-hover:shadow-[0_18px_48px_rgba(182,255,60,0.22)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 select-none font-display text-7xl font-bold text-black/[0.035] transition-colors duration-300 group-hover:text-accent-green/10"
                >
                  0{i + 1}
                </span>

                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green/25 to-accent-green/5 ring-1 ring-accent-green/20 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </span>
                <div className="relative z-10">
                  <h3 className="font-display text-base font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {feature.text}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
