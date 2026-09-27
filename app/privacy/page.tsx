import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Movade",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            Legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-text-muted">Last updated: September 16, 2026</p>

          <div className="mt-8 flex flex-col gap-8">
            {[
              {
                title: "1. What we collect",
                body: "We collect the information you provide — such as your name, email address, travel dates, and destination preferences — when you book, subscribe to updates, or reach out to us. We also collect basic analytics about how the site is used.",
              },
              {
                title: "2. How we use it",
                body: "Your information is used to confirm bookings, respond to enquiries, send newsletters you subscribed to, and improve our services. We never sell your personal data.",
              },
              {
                title: "3. Who we share it with",
                body: "We share only what is necessary with third-party travel suppliers (airlines, hotels, operators) to fulfil your booking, and with service providers who help us operate (such as hosting and email).",
              },
              {
                title: "4. Cookies & analytics",
                body: "We use essential cookies to keep you signed in and optional analytics to understand how visitors use the site. You can control cookies in your browser settings.",
              },
              {
                title: "5. Your rights",
                body: "You may request a copy of your data, correct inaccuracies, or ask us to delete your information at any time by contacting hello@movade.travel.",
              },
              {
                title: "6. Security",
                body: "We store data with industry-standard protections. Bookings and account data are kept on secure servers and access is limited to staff who need it.",
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