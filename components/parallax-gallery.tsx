"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap-config";

const IMAGES = [
  "/travel-images/22f55cc3f9c4f438dcaff5873166bc37.jpg",
  "/travel-images/644728dd03e03051ec91872eee56abce.jpg",
  "/travel-images/6d7127470eb0c4fa982a69d7ab4f0fbf.jpg",
  "/travel-images/911f4d44cff2a44ffe3c206589fa738f.jpg",
  "/travel-images/918a169bbf090069562831cff42108b1.jpg",
  "/travel-images/b55e27b99cc7b9ac2a9880e6087c8dc7.jpg",
  "/travel-images/b917fdc63744ad30426969f6d5402ce8.jpg",
  "/travel-images/bbd7a6fd1334471c8a774dcd5c4cf27b.jpg",
  "/travel-images/e7f9c5996ffd239cb580afcbaf7b39be.jpg",
  "/travel-images/ed65027a80e9751a36aa504460ba7694.jpg",
  "/travel-images/f94c5898fcc5227a6b969b303bf8a1b6.jpg",
  "/travel-images/fa6dec2785180e3f6486b6bf762d5292.jpg",
];

export default function ParallaxGallery() {
  const gallery = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      mobileCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: (i % 2) * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="w-full bg-[#F4EFE9] text-text-primary">
      <div className="flex h-[40vh] items-center justify-center md:h-[60vh]">
        <div className="grid content-start justify-items-center gap-3 px-6 text-center md:gap-4">
          <h2 className="font-display text-2xl font-bold md:text-5xl">
            Moments Worth The Trip
          </h2>
        </div>
      </div>

      {/* Desktop parallax — hidden on mobile via CSS only (no JS branching) */}
      <div
        ref={gallery}
        className="relative box-border hidden h-[175vh] gap-[2vw] overflow-hidden bg-white p-[2vw] md:flex"
      >
        <GalleryColumn images={[IMAGES[0], IMAGES[1], IMAGES[2]]} y={y} />
        <GalleryColumn images={[IMAGES[3], IMAGES[4], IMAGES[5]]} y={y2} />
        <GalleryColumn images={[IMAGES[6], IMAGES[7], IMAGES[8]]} y={y3} />
        <GalleryColumn images={[IMAGES[9], IMAGES[10], IMAGES[11]]} y={y4} />
      </div>

      {/* Mobile grid — hidden on desktop via CSS only (no JS branching) */}
      <div className="grid grid-cols-2 gap-3 bg-white p-4 md:hidden">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              mobileCardsRef.current[i] = el;
            }}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex h-[25vh] flex-col items-center justify-center gap-5 md:h-[40vh]">
        <p className="font-display text-xl font-bold text-text-primary md:text-3xl">
          Book your travel destination right away
        </p>
        <button
          onClick={() => router.push("/booking")}
          className="rounded-full bg-accent-green px-8 py-3 text-sm font-semibold text-text-primary transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          Book Now
        </button>
      </div>
    </section>
  );
}

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

function GalleryColumn({ images, y }: ColumnProps) {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[220px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden rounded-2xl">
          <Image
            src={src}
            alt=""
            fill
            sizes="25vw"
            className="pointer-events-none object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
}
