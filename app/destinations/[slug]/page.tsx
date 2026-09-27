import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DestinationBooking from "@/components/destination-booking";
import { getStore } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const store = await getStore();
  const dest = store.destinations.find((d) => d.slug === params.slug);
  return {
    title: dest ? `${dest.to} Trips — Movade` : "Destination — Movade",
    description: dest?.blurb,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const store = await getStore();
  const dest = store.destinations.find((d) => d.slug === params.slug);
  if (!dest) notFound();

  const stays = store.properties.filter(
    (p) => p.country.toLowerCase() === dest.country.toLowerCase() || p.city.toLowerCase() === dest.to.toLowerCase()
  );
  const otherDests = store.destinations.filter((d) => d.slug !== dest.slug).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            ← Back to home
          </Link>

          <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-3xl md:rounded-[2rem]">
            <Image
              src={dest.image}
              alt={dest.to}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 75vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 md:p-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                  {dest.from} → {dest.country}
                </p>
                <h1 className="mt-1 font-display text-3xl font-bold text-white md:text-5xl">
                  {dest.to}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-text-primary">
                  <span className="text-accent-green">★</span>
                  {dest.rating} ({dest.reviews})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_340px] md:gap-10">
            <div>
              <p className="text-base leading-relaxed text-text-primary md:text-lg">
                {dest.blurb}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <InfoCard label="Duration" value={dest.duration} />
                <InfoCard label="Travel dates" value={dest.date} />
                <InfoCard label="Price" value={`From ${dest.price}`} />
              </div>

              <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5 md:p-6">
                <h2 className="font-display text-lg font-bold text-text-primary">
                  What&apos;s included
                </h2>
                <ul className="grid grid-cols-1 gap-2 text-sm text-text-muted sm:grid-cols-2">
                  {[
                    "Round-trip flights from " + dest.from,
                    "Hand-picked accommodation",
                    "Daily itinerary & mobile support",
                    "24/7 on-trip assistance",
                    "Airport transfers",
                    "Travel insurance guidance",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6.2L4.8 9L10 3.5" stroke="#0B0F0D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="h-fit rounded-3xl border border-border-subtle bg-white p-6 shadow-floating">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                Ready when you are
              </p>
              <p className="mt-3 font-display text-2xl font-bold text-text-primary">
                {dest.price}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                per person · includes flights & stays
              </p>
              <div className="mt-5">
                <DestinationBooking title={dest.to} destination={dest.to} />
              </div>
              <ul className="mt-5 flex flex-col gap-2 text-xs text-text-muted">
                <li>✓ Free cancellation up to 14 days</li>
                <li>✓ Pay securely, confirm fast</li>
                <li>✓ Local expert on call</li>
              </ul>
            </div>
          </div>
        </div>

        {stays.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl px-4 pb-16 md:px-10">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Stays in {dest.to}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {stays.map((p) => (
                <Link
                  key={p.id}
                  href={`/properties?q=${encodeURIComponent(p.name)}`}
                  className="group overflow-hidden rounded-2xl border border-border-subtle bg-white transition-shadow hover:shadow-floating"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base font-bold text-text-primary">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      ${p.pricePerNight}/night · {p.rating.toFixed(1)} ★
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {otherDests.length > 0 && (
          <section className="border-t border-border-subtle">
            <div className="mx-auto max-w-6xl px-4 py-16 md:px-10">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                More destinations
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {otherDests.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={d.image}
                      alt={d.to}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <p className="absolute bottom-3 left-3 font-display text-base font-bold text-white md:text-lg">
                      {d.to}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-sm font-bold text-text-primary md:text-base">
        {value}
      </p>
    </div>
  );
}