"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap-config";
import Reveal from "@/components/ui/reveal";
import MagneticButton from "@/components/ui/magnetic-button";
import TiltCard from "@/components/ui/tilt-card";

const BLOG_CARDS = [
  {
    slug: "hidden-gems-of-india",
    image: "/travel-images/0a96943f1916d715e834aab34919e7be.jpg",
    title: "Hidden Gems of India",
    date: "Dec 5, 2025",
    category: "India",
  },
  {
    slug: "a-guide-to-indias-coastal-escapes",
    image: "/travel-images/0fa4c41f84e6f6e70057623bc670741c.jpg",
    title: "A Guide to India's Coastal Escapes",
    date: "Nov 18, 2025",
    category: "Coastal",
  },
  {
    slug: "mountain-trails-worth-the-climb",
    image: "/travel-images/1babc905994f380026708c0f1c038d8c.jpg",
    title: "Mountain Trails Worth the Climb",
    date: "Oct 30, 2025",
    category: "Adventure",
  },
];

const FEATURED = {
  slug: "chasing-golden-hour-across-the-horizon",
  image: "/travel-images/911f4d44cff2a44ffe3c206589fa738f.jpg",
  title: "Chasing Golden Hour Across the Horizon",
  date: "Nov 28, 2025",
};

const MOSAIC = [
  "/travel-images/22f55cc3f9c4f438dcaff5873166bc37.jpg",
  "/travel-images/644728dd03e03051ec91872eee56abce.jpg",
  "/travel-images/6d7127470eb0c4fa982a69d7ab4f0fbf.jpg",
];

export default function AdventuresGallery() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
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

  const handleBlogCard = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const handleAllBlogs = () => {
    router.push("/blog");
  };

  return (
    <section id="adventures" className="mx-auto max-w-7xl px-4 py-12 md:px-10 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left block */}
        <div>
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <Reveal>
              <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">
                Adventures from
                <br />
                Around the World
              </h2>
            </Reveal>
            <MagneticButton
              onClick={handleAllBlogs}
              className="border border-border-subtle px-4 py-2 text-xs font-medium md:px-5 md:py-2.5 md:text-sm"
            >
              All Blogs
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
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {BLOG_CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer"
                onClick={() => handleBlogCard(card.slug)}
              >
                <TiltCard className="group absolute inset-0 h-full w-full">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 33vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.15]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2 md:p-4">
                    <p className="text-[10px] uppercase tracking-wide text-white/70 md:text-xs">
                      {card.date}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold leading-snug text-white md:mt-1 md:text-sm">
                      {card.title}
                    </p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>

          <TiltCard
            className="group relative mt-4 aspect-[21/9] overflow-hidden rounded-2xl md:mt-6 md:rounded-3xl cursor-pointer"
            onClick={() => handleBlogCard(FEATURED.slug)}
          >
            <Image
              src={FEATURED.image}
              alt={FEATURED.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p className="text-xs uppercase tracking-wide text-white/70">
                {FEATURED.date}
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug text-white md:text-base">
                {FEATURED.title}
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Right block */}
        <div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <TiltCard className="group relative row-span-2 aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl">
              <Image
                src={MOSAIC[0]}
                alt="Aerial turquoise coastline"
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </TiltCard>
            <TiltCard className="group relative aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl">
              <Image
                src={MOSAIC[1]}
                alt="Scenic mountain view"
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </TiltCard>
            <TiltCard className="group relative aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl">
              <Image
                src={MOSAIC[2]}
                alt="Cultural destination"
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </TiltCard>
          </div>

          <Reveal className="mt-6 md:mt-8">
            <p className="text-sm font-medium text-accent-green">Start now</p>
            <h3 className="mt-2 font-display text-xl font-bold md:text-3xl">
              Plan Your Perfect Travel Escape Today
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted md:mt-4">
              Embark on a journey through stunning landscapes, serene coastlines,
              and breathtaking mountain escapes. Your unforgettable adventure
              starts here.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
