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
    | (T & { error?: string; code?: string; devCode?: string })
    | null;

  if (!res.ok || !data) {
    const message = data?.error ?? `Request failed (${res.status})`;
    const err = new Error(message) as Error & {
      code?: string;
      devCode?: string;
      status?: number;
    };
    if (data?.code) err.code = data.code;
    if (data?.devCode) err.devCode = data.devCode;
    err.status = res.status;
    throw err;
  }
  return data;
}

export function signUp(name: string, email: string, password: string) {
  return api<{ user?: PublicUser; needVerification?: boolean; email?: string; devCode?: string; resent?: boolean; error?: string; otpFailed?: boolean }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function verifySignup(email: string, code: string) {
  return api<{ user: PublicUser }>("/api/auth/verify-signup", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function resendSignupCode(email: string) {
  return api<{ ok: true; devCode?: string }>("/api/auth/resend-signup-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function sendLoginCode(email: string) {
  return api<{ ok: true; devCode?: string }>("/api/auth/send-login-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyLoginCode(email: string, code: string) {
  return api<{ user: PublicUser }>("/api/auth/verify-login-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
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

export function forgotPassword(email: string) {
  return api<{ ok: true; resetUrl?: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, password: string) {
  return api<{ ok: true }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function validateResetToken(token: string) {
  return api<{ valid: boolean }>(
    `/api/auth/reset-password?token=${encodeURIComponent(token)}`
  );
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