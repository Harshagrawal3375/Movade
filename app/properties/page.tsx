import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { getStore } from "@/lib/db";

export const metadata: Metadata = {
  title: "Stays & Properties — Movade",
  description:
    "Browse curated hotels, villas, apartments and houses hand-picked by the Movade travel team.",
};

const FILTERS = [
  { label: "All", value: "" },
  { label: "Hotel", value: "hotel" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "House", value: "house" },
  { label: "Residential", value: "residential" },
];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const store = await getStore();
  const query = (searchParams.q ?? "").trim().toLowerCase();
  const type = (searchParams.type ?? "").trim().toLowerCase();

  const termFor = (v?: string) => !!v && (!query || v.toLowerCase().includes(query));

  const properties = store.properties.filter(
    (p) =>
      (!type || p.category.toLowerCase() === type) &&
      (termFor(p.name) ||
        termFor(p.location) ||
        termFor(p.city) ||
        termFor(p.country) ||
        termFor(p.description) ||
        p.amenities.some((a) => termFor(a)))
  );

  const hrefWith = (next: { q?: string; type?: string }) => {
    const params = new URLSearchParams();
    const q = next.q ?? query;
    const t = next.type ?? "";
    if (q) params.set("q", q);
    if (t) params.set("type", t);
    const s = params.toString();
    return `/properties${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
                Curated For You
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-5xl">
                Stays worth the trip
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
                Every property is personally vetted by our team — great
                locations, honest photos, and hosts we trust.
              </p>
            </div>

            <form method="GET" action="/properties" className="w-full md:w-auto">
              <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-white p-1.5 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2 text-text-muted">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search stays…"
                  className="w-full bg-transparent px-2 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
                {type && <input type="hidden" name="type" value={type} />}
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-accent-green px-4 py-2 text-sm font-semibold text-text-primary"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = (f.value || "all") === (type || "all");
              return (
                <a
                  key={f.label}
                  href={hrefWith({ type: f.value })}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-text-primary bg-text-primary text-white"
                      : "border-border-subtle text-text-primary hover:border-text-primary"
                  }`}
                >
                  {f.label}
                </a>
              );
            })}
          </div>

          {query && (
            <p className="mt-4 text-sm text-text-muted">
              {properties.length} result{properties.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-text-primary">“{query}”</span>
            </p>
          )}
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-24 md:px-10">
          {properties.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-border-subtle bg-white p-10 text-center">
              <p className="font-display text-xl font-bold text-text-primary">
                No stays match that search
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Try a different keyword or clear the filters to see everything.
              </p>
              <a
                href="/properties"
                className="mt-5 inline-flex rounded-full bg-accent-green px-6 py-3 text-sm font-semibold text-text-primary"
              >
                Clear filters
              </a>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}