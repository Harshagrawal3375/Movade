import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "About Movade â€” Travel Agency",
  description:
    "Who we are, how we plan trips, and the stories behind Movade.",
};

const VALUES = [
  {
    title: "Local Expertise",
    text: "We don't book destinations from a map. Our team has walked the routes, tested the stays, and eaten at the tables we recommend.",
  },
  {
    title: "One Itinerary, Zero Friction",
    text: "Flights, stays, and experiences in a single plan â€” so you stop juggling spreadsheets and start looking forward to the trip.",
  },
  {
    title: "Honest Pricing",
    text: "The price you see is the price you pay. No surprise fees, no filler add-ons â€” just the trip, done properly.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            About Movade
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-5xl">
            We make travel feel effortless
          </h1>
          <p className="mt-6 text-base leading-relaxed text-text-muted md:text-lg">
            Movade started with a simple frustration: planning a good trip takes
            too much work, and the travel agency experience rarely fixes that.
            So we built the agency we wished existed â€” one that combines
            real local knowledge with a single, clear itinerary, and a team
            that stays reachable long after booking.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-muted md:text-lg">
            From weekend getaways to Cox&apos;s Bazar to coastal drives on the
            Gokarna beaches and the Konkan Coast, thousands of travelers have trusted us to handle the
            logistics so they can focus on the memories.
          </p>
        </div>

        <section className="mx-auto mt-14 max-w-6xl px-4 md:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl border border-border-subtle bg-white p-6 transition-shadow hover:shadow-floating md:p-8"
              >
                <h2 className="font-display text-lg font-bold text-text-primary md:text-xl">
                  {v.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="careers" className="mx-auto mt-16 max-w-4xl px-4 md:px-6">
          <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
            Work with us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
            We&apos;re a small, curious team always looking for travel planners
            and support heroes who genuinely love places. If that sounds like
            you, email{" "}
            <Link href="/contact" className="font-semibold text-text-primary underline-offset-4 hover:underline">
              careers@movade.travel
            </Link>
            .
          </p>
        </section>

        <section id="press" className="mx-auto mb-24 mt-14 max-w-4xl px-4 md:px-6">
          <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
            Press & media
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
            For interviews, destination commentary, or imagery, reach out via{" "}
            <Link href="/contact" className="font-semibold text-text-primary underline-offset-4 hover:underline">
              our contact page
            </Link>{" "}
            or email{" "}
            <span className="font-semibold text-text-primary">press@movade.travel</span>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}