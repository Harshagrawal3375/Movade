"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import * as api from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30";

const BUDGET_OPTIONS = [
  "Under $500",
  "$500 â€“ $1,000",
  "$1,000 â€“ $2,500",
  "$2,500 â€“ $5,000",
  "Over $5,000",
];

export default function ConsultationModal({
  open,
  onClose,
  destination,
}: {
  open: boolean;
  onClose: () => void;
  destination?: string;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dest, setDest] = useState(destination ?? "");
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setSubmitting(false);
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setDest(destination ?? "");
    }
  }, [open, destination, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.createConsultation({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        destination: dest.trim(),
        budget,
        message: message.trim() || undefined,
      });
      showToast(
        "Free consultation booked â€” a travel expert will reach out shortly!",
        "success",
        "ðŸ“…"
      );
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Book a Free Consultation">
      <p className="mb-5 text-sm leading-relaxed text-text-muted">
        Tell us where you&apos;re dreaming of going, and a travel expert will reach
        out with a free, no-obligation consultation.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cs-name" className="mb-1.5 block text-sm font-medium text-text-primary">
              Full name
            </label>
            <input
              id="cs-name"
              required
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="cs-email" className="mb-1.5 block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="cs-email"
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
            <label htmlFor="cs-phone" className="mb-1.5 block text-sm font-medium text-text-primary">
              Phone (optional)
            </label>
            <input
              id="cs-phone"
              type="tel"
              className={inputCls}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 â€¦"
            />
          </div>
          <div>
            <label htmlFor="cs-dest" className="mb-1.5 block text-sm font-medium text-text-primary">
              Dream destination
            </label>
            <input
              id="cs-dest"
              required
              className={inputCls}
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              placeholder="e.g. Goa"
            />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-text-primary">Approx. budget</span>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  budget === b
                    ? "border-text-primary bg-text-primary text-white"
                    : "border-border-subtle text-text-primary hover:border-text-primary"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="cs-msg" className="mb-1.5 block text-sm font-medium text-text-primary">
            Anything else? (optional)
          </label>
          <textarea
            id="cs-msg"
            rows={2}
            className={inputCls}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Group size, dates, must-see spotsâ€¦"
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
          {submitting ? "Booking your consultationâ€¦" : "Book free consultation"}
        </button>
      </form>
    </Modal>
  );
}