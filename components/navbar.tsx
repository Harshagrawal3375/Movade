"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap-config";
import MagneticButton from "@/components/ui/magnetic-button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = ["Home", "About Us", "Services", "Pricing", "Contact Us"];

const NAV_SECTIONS: Record<string, string> = {
  Home: "top",
  "About Us": "why-choose",
  Services: "explore-escape",
  Pricing: "popular-spots",
  "Contact Us": "footer",
};

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<(HTMLButtonElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => {
      const isScrolled = window.scrollY > 80;

      if (isScrolled) {
        gsap.to(nav, {
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(nav, {
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount to set initial state

    const onHeroProgress = (e: Event) => {
      const progress = (e as CustomEvent<number>).detail;
      const shouldHide = progress > 0.08 && progress < 0.95;
      gsap.to(nav, {
        y: shouldHide ? -120 : 0,
        opacity: shouldHide ? 0 : 1,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    window.addEventListener("hero-scroll-progress", onHeroProgress);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hero-scroll-progress", onHeroProgress);
    };
  }, []);

  const handleNavClick = (link: string) => {
    setMenuOpen(false);
    const sectionId = NAV_SECTIONS[link];
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogin = () => {
    setMenuOpen(false);
    router.push("/login");
  };

  const handleSignup = () => {
    setMenuOpen(false);
    router.push("/signup");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    showToast("You've been signed out. Safe travels!", "success", "👋");
  };

  // Always dark text — navbar stays transparent but readable over light hero
  const textColor = "text-text-primary";
  const iconColor = "#0B0F0D";
  const hoverColor = "hover:text-text-muted";
  const loginHover = "hover:text-text-muted";

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:px-10 md:py-4"
    >
      {/* Logo */}
      <button
        ref={logoRef}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="Go to top"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12L3 4l3.5 8L3 20l18-8z"
            fill={iconColor}
            stroke={iconColor}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 ${textColor}`}
        >
          Movade
        </span>
      </button>

      {/* Desktop nav links */}
      <div className="hidden items-center gap-8 rounded-full lg:flex">
        {NAV_LINKS.map((link, i) => (
          <button
            key={link}
            ref={(el) => {
              linksRef.current[i] = el;
            }}
            onClick={() => handleNavClick(link)}
            className={`text-sm font-medium transition-colors duration-300 ${textColor} ${hoverColor}`}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Desktop CTA buttons */}
      <div ref={ctaRef} className="hidden items-center gap-3 md:flex">
        {user ? (
          <>
            <span className="max-w-[160px] truncate text-sm font-medium text-text-primary">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${textColor} ${loginHover}`}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${textColor} ${loginHover}`}
            >
              Log in
            </button>
            <MagneticButton
              onClick={handleSignup}
              className="bg-accent-green px-6 py-2.5 text-sm font-semibold text-text-primary"
            >
              Sign Up
            </MagneticButton>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="flex items-center justify-center rounded-xl p-2 md:hidden"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d={menuOpen ? "M6 6L18 18M6 18L18 6" : "M4 7H20M4 12H20M4 17H20"}
            stroke={iconColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="glass absolute left-3 right-3 top-full mt-2 flex flex-col gap-1 rounded-3xl p-5 shadow-floating md:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-text-primary transition-colors hover:bg-black/5"
            >
              {link}
            </button>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-black/8 pt-3">
            {user ? (
              <>
                <p className="px-4 py-1 text-sm font-medium text-text-muted">
                  {user.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full border border-border-subtle px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-black/5"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full rounded-full border border-border-subtle px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-black/5"
                >
                  Log in
                </button>
                <button
                  onClick={handleSignup}
                  className="w-full rounded-full bg-accent-green px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:brightness-110"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
