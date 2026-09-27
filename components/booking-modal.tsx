"use client";

import Modal from "@/components/ui/modal";
import BookingForm, { BookingPayload } from "@/components/booking-form";

export type { BookingPayload } from "@/components/booking-form";

export default function BookingModal({
  open,
  onClose,
  payload,
}: {
  open: boolean;
  onClose: () => void;
  payload: BookingPayload | null;
}) {
  if (!payload) return null;

  return (
    <Modal open={open} onClose={onClose} title={<span>Book {payload.packageTitle}</span>}>
      <p className="mb-5 text-sm leading-relaxed text-text-muted">
        Confirm your details below — a real booking request our team will confirm.
        Fields marked with <span className="text-accent-green">*</span> are required.
      </p>

      <BookingForm payload={payload} />
    </Modal>
  );
}