import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SpotCard from "@/components/spot-card";
import { getStore } from "@/lib/db";

export const metadata: Metadata = {
  title: "Experiences — Movade",
  description:
    "Hand-picked tours and experiences — sunset cruises, coastal drives, heritage walks and more.",
};

export default async function ExperiencesPage() {
  const store = await getStore();

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            Handpicked For You
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-5xl">
            Experiences travelers rebook
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            The routes our travelers come back to again and again — curated for
            the views, the pace, and the stories you bring home.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 px-4 pb-24 md:grid-cols-2 lg:grid-cols-3 md:px-10">
          {store.spots.map((spot) => (
            <SpotCard key={spot.key} spot={spot} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}