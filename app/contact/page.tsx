"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import * as api from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30";

export default function ContactPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Booking question");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.createConsultation({
        name: name.trim(),
        email: email.trim(),
        destination: destination.trim() || topic,
        budget: "N/A",
        message: `${topic}\n\n${message.trim()}`,
      });
      showToast("Message sent â€” our team will reply within one business day!", "success", "ðŸ“¬");
      setMessage("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-6xl px-4 pb-24 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            Talk to a human
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            Questions about a trip, a booking you&apos;ve made, or a destination
            you&apos;re dreaming about? Send a message and our team will get back to
            you within one business day.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-3xl border border-border-subtle bg-white p-6 shadow-sm md:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Full name
                  </label>
                  <input
                    id="ct-name"
                    required
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="ct-email" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Email
                  </label>
                  <input
                    id="ct-email"
                    type="email"
                    required
                    className={inputCls}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-topic" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Topic
                  </label>
                  <select
                    id="ct-topic"
                    className={inputCls}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option>Booking question</option>
                    <option>Planning a new trip</option>
                    <option>Change or cancel a booking</option>
                    <option>Group & corporate travel</option>
                    <option>Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ct-dest" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Destination (optional)
                  </label>
                  <input
                    id="ct-dest"
                    className={inputCls}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Goa"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ct-msg" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Message
                </label>
                <textarea
                  id="ct-msg"
                  required
                  rows={5}
                  className={inputCls}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can helpâ€¦"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-green px-6 py-3.5 text-sm font-semibold text-text-primary transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sendingâ€¦" : "Send message"}
              </button>
            </form>

            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border-subtle bg-white p-6">
                <h2 className="font-display text-lg font-bold text-text-primary">
                  Talk to us directly
                </h2>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-text-muted">
                  <li>
                    <span className="font-semibold text-text-primary">Phone</span>
                    <p className="mt-0.5">+880 1234-567890</p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Email</span>
                    <p className="mt-0.5">hello@movade.travel</p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Office</span>
                    <p className="mt-0.5">Level 8, Nariman Point, Mumbai</p>
                  </li>
                  <li>
                    <span className="font-semibold text-text-primary">Hours</span>
                    <p className="mt-0.5">Sunâ€“Thu, 10:00 â€“ 19:00</p>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl bg-bg-dark p-6 text-white">
                <h2 className="font-display text-lg font-bold">24/7 on-trip support</h2>
                <p className="mt-2 text-sm text-white/70">
                  Already traveling? Our support line stays open around the clock
                  at <span className="font-semibold text-accent-green">+880 1234-000000</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}