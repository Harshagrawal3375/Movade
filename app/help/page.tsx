import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Help Center — Movade",
};

const FAQS = [
  {
    q: "How do I book a trip?",
    a: "Use the search widget on the home page to find a destination or stay, then confirm your details in the booking form. Our team reviews every request and follows up within one business day.",
  },
  {
    q: "When do I pay?",
    a: "Bookings are confirmed after payment, which we'll arrange by phone or a secure link once your itinerary is finalized. You'll never be asked for payment on an unconfirmed plan.",
  },
  {
    q: "Can I change or cancel my booking?",
    a: "Yes. Most packages allow free changes up to 14 days before departure. Contact our team through the contact page and we'll rebook flights, stays, or experiences for you.",
  },
  {
    q: "What documents do I need?",
    a: "A passport valid for at least six months beyond your return date, plus any visas or vaccinations required by your destination. We'll send a personalized checklist with your confirmation.",
  },
  {
    q: "Is travel insurance included?",
    a: "Insurance isn't included by default, but our team can arrange a policy that matches your trip — medical cover, cancellation, and baggage — during booking.",
  },
  {
    q: "What happens if my flight changes while I'm away?",
    a: "Our 24/7 support line handles it. Call us and we'll rebook you, update your itinerary, and let you know what's changing.",
  },
];

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            Support
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            How can we help?
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            Quick answers to the questions we hear most. Can&apos;t find yours?{" "}
            <Link href="/contact" className="font-semibold text-text-primary underline-offset-4 hover:underline">
              Reach out to us
            </Link>
            .
          </p>

          <section id="faqs" className="mt-10 flex flex-col gap-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-border-subtle bg-white p-5 transition-shadow open:shadow-floating"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-text-primary">
                  {faq.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle transition-transform group-open:rotate-45">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </section>

          <div className="mt-10 rounded-3xl bg-bg-dark p-6 text-white md:p-8">
            <h2 className="font-display text-xl font-bold">Still need a human?</h2>
            <p className="mt-2 text-sm text-white/70">
              Our support team replies within one business day. For on-trip
              emergencies, call us any hour.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-green px-6 py-3 text-sm font-semibold text-text-primary transition-transform hover:scale-[1.02]"
            >
              Contact support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}