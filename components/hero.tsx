"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import HeroScrollCanvas from "@/components/hero-scroll-canvas";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            window.dispatchEvent(
              new CustomEvent("hero-scroll-progress", { detail: self.progress })
            );
          },
          onLeaveBack: () => {
            window.dispatchEvent(
              new CustomEvent("hero-scroll-progress", { detail: 0 })
            );
          },
        },
      });

      scrollTl.to(
        contentRef.current,
        {
          y: -60,
          opacity: 0,
          ease: "power1.in",
        },
        0
      );

      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        badgeRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );

      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".word");
        tl.fromTo(
          words,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        );
      }

      tl.fromTo(
        subRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingLine1 = "Explore the World,";
  const headingLine2 = "One Journey at a Time.";

  return (
    <section
      id="home"
      ref={sectionRef}
      className="sticky top-0 z-0 min-h-[100svh] bg-white p-2 md:p-5"
    >
      <div className="relative flex h-[calc(100svh-1rem)] w-full flex-col items-center justify-center overflow-hidden rounded-[24px] bg-bg-dark pb-36 pt-20 md:h-[calc(100svh-2.5rem)] md:pb-20 md:rounded-[40px]">
        <HeroScrollCanvas
          progressRef={progressRef}
          className="absolute inset-0 h-full w-full"
        />
        <div
          ref={contentRef}
          className="relative z-10 flex -translate-y-10 flex-col items-center px-4 text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] md:-translate-y-16 md:px-6"
        >
          <div
            ref={badgeRef}
            className="mb-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-text-primary shadow-floating md:mb-6 md:text-sm"
          >
            <span className="text-accent-green">✦</span>
            Travel More, Worry Less
          </div>

          <h1
            ref={headingRef}
            className="max-w-4xl font-display text-[2rem] font-bold leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <span className="block overflow-hidden pb-1">
              {headingLine1.split(" ").map((w, i) => (
                <span key={i} className="word mr-2 inline-block md:mr-3">
                  {w}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-1">
              {headingLine2.split(" ").map((w, i) => (
                <span key={i} className="word mr-2 inline-block md:mr-3">
                  {w}
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-3 max-w-[560px] text-sm leading-relaxed text-white/80 md:mt-4 md:text-base"
          >
            Our travel agency offers personalized and hassle-free travel
            experiences, tailored to meet your unique preferences and needs.
          </p>
        </div>
      </div>
    </section>
  );

}
