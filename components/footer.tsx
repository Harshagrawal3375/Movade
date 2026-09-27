"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import * as api from "@/lib/api";

const LINK_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/about#careers" },
      { label: "Press", href: "/about#press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Goa", href: "/destinations/goa" },
      { label: "Jaipur", href: "/destinations/jaipur" },
      { label: "Udaipur", href: "/destinations/udaipur" },
      { label: "Lakshadweep", href: "/destinations/lakshadweep" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "FAQs", href: "/help#faqs" },
    ],
  },
];

const SOCIALS = [
  {
    name: "Instagram",
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
    name: "Twitter",
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
  {
    name: "Facebook",
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
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="8.5" r="1.3" fill="currentColor" />
        <path d="M8 11.5v6M12 17.5v-4c0-1.5 1-2.5 2.3-2.5S17 12 17 13.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 11.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address.", "warning", "✉️");
      return;
    }
    setSubscribing(true);
    try {
      await api.subscribeEmail(email.trim());
      showToast("Subscribed! Travel tips and offers are on the way.", "success", "🎉");
      setEmail("");
    } catch (err) {
      showToast((err as Error).message, "warning", "✉️");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer
      id="footer"
      className="relative flex min-h-[500px] flex-col overflow-hidden bg-bg-dark px-4 pb-8 pt-16 text-text-primary md:px-10 md:pt-20"
    >
      <Image
        src="/footer.png"
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition: "center 62%" }}
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <div className="grid grid-cols-2 gap-8 border-b border-black/10 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] lg:gap-12 lg:pb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 focus:outline-none"
              aria-label="Go to top"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 12L3 4l3.5 8L3 20l18-8z"
                  fill="#0B0F0D"
                  stroke="#0B0F0D"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-xl font-bold">Movade</span>
            </button>
            <p className="mt-4 max-w-xs text-sm font-bold leading-relaxed text-text-primary">
              Explore the world, one journey at a time — personalized,
              hassle-free travel experiences tailored to you.
            </p>
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-extrabold text-text-primary">
                {col.title}
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5 md:mt-4 md:gap-3">
                {col.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-left text-sm font-bold text-text-primary transition-opacity hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="font-display text-sm font-extrabold text-text-primary">
              Stay Updated
            </h4>
            <p className="mt-3 text-sm font-bold text-text-primary md:mt-4">
              Subscribe for travel tips and exclusive offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-3 flex items-center gap-2 rounded-full border border-black/20 bg-white/70 p-1.5 backdrop-blur-sm md:mt-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent px-3 text-sm font-bold text-text-primary outline-none placeholder:font-bold placeholder:text-text-primary/50"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="shrink-0 rounded-full bg-accent-green px-3 py-2 text-xs font-semibold text-text-primary transition-transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 md:px-4"
              >
                {subscribing ? "…" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-between gap-4 pt-6 md:flex-row md:pt-8">
          <p className="text-xs font-bold text-text-primary">
            © 2026 Movade. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white/70 text-text-primary backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-text-primary hover:bg-text-primary hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/terms" className="text-xs font-bold text-text-primary hover:opacity-70">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs font-bold text-text-primary hover:opacity-70">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}