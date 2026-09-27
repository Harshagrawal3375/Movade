"use client";

import { useRef, useState, MouseEvent, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { gsap } from "@/lib/gsap-config";
import { Chip } from "@/components/ui/pill";
import MagneticButton from "@/components/ui/magnetic-button";
import { useToast } from "@/components/ui/toast";
import BookingModal, { BookingPayload } from "@/components/booking-modal";
import * as api from "@/lib/api";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const RESIDENCE_TABS = ["All Residences", "Hotel", "Apartment", "Villa"];
const FILTER_CHIPS = ["All", "House", "Hotel", "Residential", "Apartment"];
const CATEGORY_FOR: Record<string, string> = {
  "All Residences": "",
  Hotel: "hotel",
  Apartment: "apartment",
  Villa: "villa",
  House: "house",
  Residential: "residential",
  All: "",
};

interface SearchResults {
  destinations: {
    slug: string;
    to: string;
    country: string;
    image: string;
    price: string;
  }[];
  properties: {
    id: string;
    slug: string;
    name: string;
    category: string;
    location: string;
    city: string;
    pricePerNight: number;
    image: string;
  }[];
  spots: {
    key: string;
    title: string;
    image: string;
    price: string | null;
  }[];
}

export default function SearchWidget({
  progressRef,
}: {
  progressRef?: React.MutableRefObject<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bookPayload, setBookPayload] = useState<BookingPayload | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  // Fade out search bar as hero scrolls
  useEffect(() => {
    if (!progressRef) return;
    const el = wrapRef.current;
    if (!el) return;

    const onProgress = (e: Event) => {
      const progress = (e as CustomEvent<number>).detail;
      const opacity = 1 - Math.min(1, Math.max(0, (progress - 0.2) / 0.15));
      const translateY = Math.max(0, progress - 0.2) * -50;
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)`;
      el.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
    };

    window.addEventListener("hero-scroll-progress", onProgress);
    return () => window.removeEventListener("hero-scroll-progress", onProgress);
  }, [progressRef]);

  const selectCategory = useCallback((label: string) => {
    setCategory(CATEGORY_FOR[label] ?? "");
    const tabIndex = RESIDENCE_TABS.findIndex((t) => CATEGORY_FOR[t] === CATEGORY_FOR[label]);
    setActiveTab(tabIndex >= 0 ? tabIndex : 0);
    const chipIndex = FILTER_CHIPS.findIndex((c) => CATEGORY_FOR[c] === CATEGORY_FOR[label]);
    setActiveChip(chipIndex >= 0 ? chipIndex : 0);
  }, []);

  const runSearch = useCallback(
    async (query: string, cat: string, open: boolean) => {
      if (!query.trim()) {
        setResults(null);
        setShowResults(false);
        return null;
      }
      setSearching(true);
      setShowResults(open);
      try {
        const data = await api.searchContent(query.trim(), cat);
        setResults(data);
        return data;
      } catch {
        const empty = { destinations: [], properties: [], spots: [] };
        setResults(empty);
        return empty;
      } finally {
        setSearching(false);
      }
    },
    []
  );

  // Live search as the user types
  useEffect(() => {
    if (location.trim().length < 2) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      runSearch(location, category, true);
    }, 350);
    return () => clearTimeout(t);
  }, [location, category, runSearch]);

  const handleSearch = async () => {
    if (!location.trim()) {
      showToast("Please enter a destination to search!", "warning", "📍");
      return;
    }
    const data = await runSearch(location, category, true);
    const total =
      (data?.destinations.length ?? 0) +
      (data?.properties.length ?? 0) +
      (data?.spots.length ?? 0);
    if (total > 0) {
      showToast(`Found ${total} matching options for "${location}"`, "success", "🔍");
    }
  };

  const openDestination = (slug: string) => {
    setShowResults(false);
    router.push(`/destinations/${slug}`);
  };

  const openPropertyBooking = (p: NonNullable<SearchResults["properties"]>[number]) => {
    setBookPayload({
      packageTitle: p.name,
      packageType: p.category,
      destination: `${p.city}, ${p.location}`,
      checkout: checkIn || undefined,
    });
    setShowResults(false);
  };

  const openSpotBooking = (s: NonNullable<SearchResults["spots"]>[number]) => {
    setBookPayload({
      packageTitle: s.title,
      packageType: "Experience",
      destination: s.key,
      checkout: checkIn || undefined,
    });
    setShowResults(false);
  };

  const totalResults =
    (results?.destinations.length ?? 0) +
    (results?.properties.length ?? 0) +
    (results?.spots.length ?? 0);

  return (
    <div ref={wrapRef} className="relative w-full max-w-6xl">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="glass w-full rounded-3xl border border-white/40 p-4 shadow-floating md:p-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="font-display text-lg font-bold md:text-2xl">
            Find the best place
          </h3>
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-border-subtle bg-white/60 p-1">
            {RESIDENCE_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => selectCategory(tab)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 md:px-4 md:py-2 md:text-sm",
                  activeTab === i
                    ? "bg-text-primary text-white"
                    : "text-text-primary hover:text-text-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          <Field
            label="Location"
            placeholder="Type the destination"
            value={location}
            onChange={setLocation}
          />
          <Field
            label="Check In"
            placeholder="Add date"
            type="date"
            value={checkIn}
            onChange={setCheckIn}
          />
          <Field
            label="Check Out"
            placeholder="Add date"
            type="date"
            value={checkOut}
            onChange={setCheckOut}
          />
          <Field
            label="Participants"
            placeholder="Add guests"
            value={guests}
            onChange={setGuests}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-text-muted">Filter:</span>
            {FILTER_CHIPS.map((chip, i) => (
              <Chip key={chip} active={activeChip === i} onClick={() => selectCategory(chip)}>
                {chip}
              </Chip>
            ))}
          </div>

          <MagneticButton
            onClick={handleSearch}
            className="w-full bg-accent-green px-6 py-3 text-sm font-semibold text-text-primary md:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#0B0F0D" strokeWidth="1.5" />
              <path
                d="M11 11L14.5 14.5"
                stroke="#0B0F0D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Search Properties
          </MagneticButton>
        </div>
      </motion.div>

      {/* Real search results */}
      {showResults && (
        <div className="absolute bottom-full left-0 right-0 z-40 mb-3">
          <div className="max-h-[320px] w-full overflow-y-auto rounded-2xl border border-white/40 bg-white p-3 shadow-floating md:max-h-[380px] md:p-4">
            {searching ? (
              <p className="px-2 py-8 text-center text-sm text-text-muted">
                Searching destinations, stays and experiences…
              </p>
            ) : totalResults === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-text-muted">
                No matches for “{location}”. Try another destination.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {results!.destinations.length > 0 && (
                  <>
                    <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                      Destinations
                    </p>
                    {results!.destinations.map((d) => (
                      <ResultRow
                        key={`dest-${d.slug}`}
                        image={d.image}
                        title={d.to}
                        meta={`${d.country} · ${d.price}`}
                        onClick={() => openDestination(d.slug)}
                      />
                    ))}
                  </>
                )}
                {results!.properties.length > 0 && (
                  <>
                    <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                      Stays
                    </p>
                    {results!.properties.map((p) => (
                      <ResultRow
                        key={`prop-${p.id}`}
                        image={p.image}
                        title={p.name}
                        meta={`${p.category} · ${p.city} · $${p.pricePerNight}/night`}
                        onClick={() => openPropertyBooking(p)}
                      />
                    ))}
                  </>
                )}
                {results!.spots.length > 0 && (
                  <>
                    <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                      Experiences
                    </p>
                    {results!.spots.map((s) => (
                      <ResultRow
                        key={`spot-${s.key}`}
                        image={s.image}
                        title={s.title}
                        meta={s.price ? `From ${s.price}` : "Inquire for pricing"}
                        onClick={() => openSpotBooking(s)}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <BookingModal
        open={bookPayload !== null}
        onClose={() => setBookPayload(null)}
        payload={bookPayload}
      />
    </div>
  );
}

function ResultRow({
  image,
  title,
  meta,
  onClick,
}: {
  image: string;
  title: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-black/[0.04]"
    >
      <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-text-primary">
          {title}
        </span>
        <span className="block truncate text-xs text-text-muted">{meta}</span>
      </span>
    </button>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border-subtle bg-white/70 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-text-primary"
      />
    </div>
  );
}