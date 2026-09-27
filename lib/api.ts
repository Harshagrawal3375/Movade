import type { PublicUser } from "@/lib/types";

async function api<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!res.ok || !data) {
    const message = data?.error ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export function signUp(name: string, email: string, password: string) {
  return api<{ user: PublicUser }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function signIn(email: string, password: string) {
  return api<{ user: PublicUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signOut() {
  return api<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function fetchMe() {
  return api<{ user: PublicUser | null }>("/api/auth/me");
}

export function createBooking(payload: {
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  adults: number;
  children: number;
  infants: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  packageTitle: string;
  packageType: string;
  destination: string;
  departureCity?: string;
  travelMode?: string;
  flightClass?: string;
  hotelStar?: string;
  roomType?: string;
  estimatedFare?: number;
  dietaryRequirements?: string;
  mealPreference?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportIssuingCountry?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  specialRequests?: string;
  notes?: string;
}) {
  return api<{ ok: true; id: string }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createPaymentOrder(bookingId: string) {
  return api<{
    ok: true;
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }>("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export function verifyPayment(payload: {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return api<{ ok: true; bookingId: string; paymentId: string }>(
    "/api/payments/verify",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function createConsultation(payload: {
  name: string;
  email: string;
  phone?: string;
  destination: string;
  budget: string;
  message?: string;
}) {
  return api<{ ok: true }>("/api/consultations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function subscribeEmail(email: string) {
  return api<{ ok: true }>("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function createTestimonial(payload: {
  name: string;
  role: string;
  quote: string;
}) {
  return api<{ ok: true }>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function searchContent(query: string, category?: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("type", category);
  return api<{
    destinations: { slug: string; to: string; country: string; image: string; price: string }[];
    properties: { id: string; slug: string; name: string; category: string; location: string; city: string; pricePerNight: number; image: string }[];
    spots: { key: string; title: string; image: string; price: string | null }[];
  }>(`/api/search?${params.toString()}`);
}