"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import * as api from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent-green focus:ring-2 focus:ring-accent-green/30";

export default function TestimonialForm({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.createTestimonial({
        name: name.trim(),
        role: role.trim() || "Verified Traveler",
        quote: quote.trim(),
      });
      showToast("Thanks for sharing â€” your review has been added!", "success", "âœ¨");
      setName("");
      setRole("");
      setQuote("");
      onClose();
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Share Your Experience">
      <p className="mb-5 text-sm leading-relaxed text-text-muted">
        Traveled with us? Tell other travelers how it went â€” your review appears
        in the constellation above.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="t-name" className="mb-1.5 block text-sm font-medium text-text-primary">
              Your name
            </label>
            <input
              id="t-name"
              required
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="t-role" className="mb-1.5 block text-sm font-medium text-text-primary">
              Trip (e.g. Honeymoon · Lakshadweep)
            </label>
            <input
              id="t-role"
              className={inputCls}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Honeymoon · Lakshadweep"
            />
          </div>
        </div>

        <div>
          <label htmlFor="t-quote" className="mb-1.5 block text-sm font-medium text-text-primary">
            Your review
          </label>
          <textarea
            id="t-quote"
            required
            rows={4}
            minLength={10}
            className={inputCls}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="What made your trip unforgettable?"
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
          {submitting ? "Posting your reviewâ€¦" : "Post review"}
        </button>
      </form>
    </Modal>
  );
}