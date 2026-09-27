import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BookingForm, { BookingPayload } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Book Your Trip — Movade",
  description:
    "Request your custom trip with Movade. Share your details and our travel experts will craft the perfect journey.",
};

const BG_IMAGES = [
  "/travel-images/918a169bbf090069562831cff42108b1.jpg",
  "/travel-images/0a96943f1916d715e834aab34919e7be.jpg",
  "/travel-images/b917fdc63744ad30426969f6d5402ce8.jpg",
  "/travel-images/fa6dec2785180e3f6486b6bf762d5292.jpg",
];

export default function BookingPage() {
  const payload: BookingPayload = {
    packageTitle: "Custom Travel Escape",
    packageType: "Trip Planning",
    destination: "Worldwide",
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#F4EFE9]">
        <section className="relative isolate overflow-hidden bg-bg-dark pb-24 pt-28 md:pb-32 md:pt-36">
          <div className="absolute inset-0 -z-10 grid grid-cols-2 gap-2 md:grid-cols-4">
            {BG_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`relative aspect-[3/4] overflow-hidden md:aspect-auto ${i === 2 ? "translate-y-10" : ""} ${i === 3 ? "-translate-y-10" : ""}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover opacity-60"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#F4EFE9] via-bg-dark/60 to-bg-dark/80" />

          <div className="mx-auto max-w-3xl px-4 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green">
              Start now
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
              Book Your Travel Destination{" "}
              <span className="text-accent-green">Right Away</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              Share your traveller and trip details below — our team will confirm
              your custom escape within one business day.
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-3xl px-4 pb-24 md:px-10">
          <div className="-mt-24 rounded-3xl border border-border-subtle bg-white p-5 shadow-floating md:-mt-28 md:p-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Custom Travel Escape
              </h2>
              <Link
                href="/"
                className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                ← Back to home
              </Link>
            </div>
            <BookingForm payload={payload} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}