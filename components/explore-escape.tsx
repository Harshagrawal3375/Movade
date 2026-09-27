"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { gsap } from "@/lib/gsap-config";
import Reveal from "@/components/ui/reveal";
import TiltCard from "@/components/ui/tilt-card";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const GOLD = "#C9A26D";

const CARDS = [
  {
    key: "coastal",
    title: "Coastal\nRetreats",
    text: "Relax by the ocean and rejuvenate.",
    image: "/travel-images/e7f9c5996ffd239cb580afcbaf7b39be.jpg",
    variant: "framed" as const,
    search: "coast",
  },
  {
    key: "water",
    title: "Water\nAdventures",
    text: "Dive into crystal clear waters.",
    image: "/travel-images/ed65027a80e9751a36aa504460ba7694.jpg",
    variant: "overlay" as const,
    search: "lagoon",
  },
  {
    key: "cultural",
    title: "Cultural\nJourneys",
    text: "Discover stories, heritage and people.",
    image: "/travel-images/f94c5898fcc5227a6b969b303bf8a1b6.jpg",
    variant: "overlay" as const,
    search: "heritage",
  },
  {
    key: "mountain",
    title: "Mountain\nEscapes",
    text: "Breathe in the wild and find your calm.",
    image: "/travel-images/fa6dec2785180e3f6486b6bf762d5292.jpg",
    variant: "overlay" as const,
    search: "mountain",
  },
];

function ArrowCircle({ tone }: { tone: "gold" | "white" }) {
  const color = tone === "gold" ? GOLD : "#FFFFFF";
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300"
      style={{ borderColor: color, color }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path
          d="M1 7H13M13 7L8 2M13 7L8 12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function ExploreEscape() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.1,
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

  const handleCardClick = (card: (typeof CARDS)[0]) => {
    router.push(`/properties?q=${encodeURIComponent(card.search)}`);
  };

  return (
    <section id="explore-escape" className="relative z-10 overflow-hidden rounded-t-[32px] bg-white px-4 py-16 shadow-[0_-30px_60px_rgba(0,0,0,0.15)] md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-start justify-between md:mb-14">
          <Reveal>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: GOLD }}
            >
              Explore the Unseen
            </p>
            <h2
              className={`${playfair.className} mt-3 text-3xl font-medium leading-[1.1] text-text-primary md:text-5xl`}
            >
              Find your
              <br />
              next <em className="italic" style={{ color: GOLD }}>
                escape
              </em>
              .
            </h2>
          </Reveal>

          <div className="relative hidden h-24 w-24 shrink-0 items-center justify-center md:flex">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#0B0F0D"
                strokeOpacity="0.25"
                strokeWidth="0.6"
              />
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text fontSize="7.5" fill="#0B0F0D" letterSpacing="2">
                <textPath href="#circlePath">ADVENTURE AWAITS · EXPLORE ·</textPath>
              </text>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="-rotate-45">
              <path d="M21 12L3 4l3.5 8L3 20l18-8z" fill="#0B0F0D" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:h-[420px] md:grid-cols-3 md:grid-rows-2 md:gap-5">
          {CARDS.map((card, cardIndex) => {
            if (card.variant === "framed") {
              return (
                <div
                  key={card.key}
                  ref={(el) => {
                    cardsRef.current[cardIndex] = el;
                  }}
                  className="flex flex-col md:col-start-1 md:row-span-2"
                >
                  <div className="pb-3 pr-4 md:pb-4">
                    <h3
                      className={`${playfair.className} whitespace-pre-line text-xl leading-[1.15] text-text-primary md:text-[1.75rem]`}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 max-w-[220px] text-sm text-text-muted">
                      {card.text}
                    </p>
                  </div>
                  <div className="relative z-10 -mb-[18px] ml-0">
                    <button
                      onClick={() => handleCardClick(card)}
                      aria-label={`Explore ${card.title}`}
                    >
                      <ArrowCircle tone="gold" />
                    </button>
                  </div>
                  <TiltCard className="group relative mt-0 aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:flex-1 md:rounded-3xl">
                    <Image
                      src={card.image}
                      alt={card.title.replace("\n", " ")}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </TiltCard>
                </div>
              );
            }

            const spanClass =
              card.key === "water"
                ? "md:col-start-2 md:row-span-2"
                : card.key === "cultural"
                ? "md:col-start-3 md:row-start-1"
                : "md:col-start-3 md:row-start-2";

            return (
              <div
                key={card.key}
                ref={(el) => {
                  cardsRef.current[cardIndex] = el;
                }}
                className={`relative aspect-[4/3] md:aspect-auto md:h-full ${spanClass}`}
              >
              <TiltCard
                className="group relative h-full w-full overflow-hidden rounded-2xl md:rounded-3xl"
                onClick={() => handleCardClick(card)}
              >
                <Image
                  src={card.image}
                  alt={card.title.replace("\n", " ")}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-black/55 via-black/15 to-transparent" />
                <div className="absolute inset-0 flex cursor-pointer flex-col justify-start p-4 md:p-6">
                  <h3
                    className={`${playfair.className} whitespace-pre-line text-lg leading-[1.15] text-white md:text-2xl`}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-1.5 max-w-[180px] text-xs text-white/85 md:mt-2 md:text-sm">
                    {card.text}
                  </p>
                  <div className="mt-3 md:mt-4">
                    <ArrowCircle tone="white" />
                  </div>
                </div>
              </TiltCard>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-right text-xs font-medium uppercase tracking-[0.2em] text-text-muted md:mt-10">
          Live. <span style={{ color: GOLD }}>Explore.</span> Remember.
        </p>
      </div>
    </section>
  );
}
