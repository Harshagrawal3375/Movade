"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";
import clsx from "clsx";

interface AccordionItemProps {
  title: string;
  body?: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
  isLast?: boolean;
}

export default function AccordionItem({
  title,
  body,
  isOpen,
  onClick,
  index,
  isLast,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.to(iconRef.current, {
        rotate: 45,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(iconRef.current, {
        rotate: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, [isOpen]);

  return (
    <div className="relative flex gap-4 pl-1 md:gap-5">
      {/* Timeline rail */}
      <div className="relative flex shrink-0 flex-col items-center">
        <span
          className={clsx(
            "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold transition-all duration-300 md:h-10 md:w-10 md:text-sm",
            isOpen
              ? "scale-110 bg-accent-green text-text-primary shadow-[0_0_0_5px_rgba(182,255,60,0.2)]"
              : "border border-border-subtle bg-white text-text-muted"
          )}
        >
          0{index + 1}
        </span>
        {!isLast && (
          <span
            className={clsx(
              "w-px flex-1 transition-colors duration-500",
              isOpen ? "bg-accent-green/50" : "bg-border-subtle"
            )}
          />
        )}
      </div>

      <button
        onClick={onClick}
        className={clsx(
          "flex-1 rounded-2xl px-4 py-4 text-left transition-colors duration-300 md:px-5",
          isOpen ? "bg-accent-green/[0.06]" : "hover:bg-black/[0.02]"
        )}
        style={{ marginBottom: isLast ? 0 : "0.25rem" }}
      >
        <span className="flex w-full items-center justify-between gap-4">
          <span
            className={clsx(
              "font-display text-base font-bold transition-colors duration-300 md:text-xl",
              isOpen ? "text-text-primary" : "text-text-muted"
            )}
          >
            {title}
          </span>
          <span
            ref={iconRef}
            className={clsx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
              isOpen
                ? "border-text-primary text-text-primary"
                : "border-border-subtle text-text-muted"
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1V11M1 6H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
        <div
          ref={contentRef}
          style={{ height: 0, opacity: 0, overflow: "hidden" }}
        >
          {body && (
            <p className="max-w-md pr-4 pt-3 text-sm leading-relaxed text-text-muted">
              {body}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}
