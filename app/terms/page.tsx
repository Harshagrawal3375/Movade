import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service — Movade",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            Legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-text-muted">Last updated: September 16, 2026</p>

          <div className="mt-8 flex flex-col gap-8">
            {[
              {
                title: "1. Bookings",
                body: "When you submit a booking request, we coordinate with our partner suppliers (airlines, hotels, and operators) to confirm availability. A booking is only final once you receive written confirmation from Movade. Prices are subject to change until confirmation.",
              },
              {
                title: "2. Payments",
                body: "Payments are processed through secure channels. Full or partial payment may be required at confirmation. All prices shown are per person unless stated otherwise and may include taxes and fees where indicated.",
              },
              {
                title: "3. Cancellations & refunds",
                body: "Free cancellation is available on most packages up to 14 days before departure. After that, cancellation fees from suppliers apply and will be communicated clearly before you confirm. No-shows are non-refundable.",
              },
              {
                title: "4. Travel documents",
                body: "You are responsible for ensuring you hold a valid passport, visas, and any required vaccinations for your destination. Movade provides guidance but is not liable for entry refusals.",
              },
              {
                title: "5. Liability",
                body: "Movade acts as an intermediary for third-party travel suppliers. While we do our best to choose reliable partners, our liability is limited to the services we directly provide. Travel insurance is strongly recommended and can be arranged by our team.",
              },
              {
                title: "6. Changes to these terms",
                body: "We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.",
              },
            ].map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-lg font-bold text-text-primary">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted md:text-base">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}