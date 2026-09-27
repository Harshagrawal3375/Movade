"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap-config";
import Reveal from "@/components/ui/reveal";
import TiltCard from "@/components/ui/tilt-card";

const DESTINATIONS = [
  {
    slug: "goa",
    from: "Delhi",
    to: "Goa",
    date: "Fri, May 21 - Mon, Jun 10",
    price: "₹16,500",
    image: "/travel-images/918a169bbf090069562831cff42108b1.jpg",
  },
  {
    slug: "jaipur",
    from: "Delhi",
    to: "Jaipur",
    date: "Fri, May 21 - Mon, Jun 10",
    price: "₹9,999",
    image: "/travel-images/b55e27b99cc7b9ac2a9880e6087c8dc7.jpg",
  },
  {
    slug: "mumbai",
    from: "Delhi",
    to: "Mumbai",
    date: "Fri, May 21 - Mon, Jun 10",
    price: "₹11,499",
    image: "/travel-images/b917fdc63744ad30426969f6d5402ce8.jpg",
  },
  {
    slug: "pondicherry",
    from: "Delhi",
    to: "Pondicherry",
    date: "Fri, May 21 - Mon, Jun 10",
    price: "₹8,750",
    image: "/travel-images/bbd7a6fd1334471c8a774dcd5c4cf27b.jpg",
  },
];

export default function PopularDestinations() {
  const railRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  const scrollBy = (dir: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.92, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
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

      imagesRef.current.forEach((img, i) => {
        if (!img) return;
        const depth = i % 2 === 0 ? 24 : 36;
        gsap.fromTo(
          img,
          { y: -depth },
          {
            y: depth,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const handleDestinationClick = (dest: (typeof DESTINATIONS)[0]) => {
    router.push(`/destinations/${dest.slug}`);
  };

  return (
    <section id="popular-destinations" className="w-full pb-16 pt-20 md:pb-24 md:pt-32">
      <div className="mb-8 flex items-end justify-between px-4 md:mb-10 md:px-10">
        <Reveal>
          <h2 className="font-display text-2xl font-bold md:text-4xl lg:text-5xl">
            Popular <span className="font-normal">destination</span>
          </h2>
        </Reveal>
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle transition-colors hover:bg-text-primary hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle transition-colors hover:bg-text-primary hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:gap-6 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DESTINATIONS.map((dest, i) => (
          <div
            key={i}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="w-[72vw] shrink-0 snap-start sm:w-[55vw] md:w-[calc(25%-1.2rem)] cursor-pointer"
            onClick={() => handleDestinationClick(dest)}
          >
            <TiltCard className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl md:rounded-3xl">
              <div
                ref={(el) => {
                  imagesRef.current[i] = el;
                }}
                className="absolute inset-[-8%]"
              >
                <Image
                  src={dest.image}
                  alt={`${dest.from} to ${dest.to}`}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </TiltCard>
            <div className="mt-3 flex items-center gap-2 font-display text-sm font-semibold md:mt-4 md:text-base">
              <span>{dest.from}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7H13M13 7L8 2M13 7L8 12"
                  stroke="#0B0F0D"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{dest.to}</span>
            </div>
            <p className="mt-1 text-xs text-text-muted md:text-sm">{dest.date}</p>
            <p className="mt-1 text-xs font-medium md:text-sm">From {dest.price}</p>
          </div>
        ))}
      </div>

      {/* Mobile swipe hint */}
      <p className="mt-3 px-4 text-center text-xs text-text-muted md:hidden">
        ← Swipe to see more →
      </p>
    </section>
  );
}
