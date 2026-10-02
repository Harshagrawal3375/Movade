import { NextRequest, NextResponse } from "next/server";
import { createBooking, findBookingsByEmail } from "@/lib/repo";
import { getCurrentUser } from "@/lib/auth-server";
import type { Booking } from "@/lib/types";

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Trimmed string, or undefined for anything empty/non-textual. */
function text(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const bookings = await findBookingsByEmail(user.email);
  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<Booking> | null;

  if (!body || !text(body.name) || !text(body.email)) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!text(body.email)?.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!text(body.packageTitle)) {
    return NextResponse.json({ error: "Missing package information." }, { status: 400 });
  }
  if (!text(body.phone)) {
    return NextResponse.json({ error: "A phone number is required so we can confirm your booking." }, { status: 400 });
  }
  if (!body.nationality?.trim()) {
    body.nationality = "Indian";
  }
  if (!body.checkIn || !isDate(body.checkIn) || !body.checkOut || !isDate(body.checkOut)) {
    return NextResponse.json({ error: "Please provide valid check-in and check-out dates." }, { status: 400 });
  }
  const guests = Number(body.guests);
  if (!Number.isFinite(guests) || guests < 1 || guests > 40) {
    return NextResponse.json({ error: "Please provide a valid number of guests." }, { status: 400 });
  }
  const adults = Number(body.adults) || 0;
  const children = Number(body.children) || 0;
  const infants = Number(body.infants) || 0;
  if (
    !Number.isFinite(adults) || adults < 1 || adults > 40 ||
    !Number.isFinite(children) || children < 0 || children > 40 ||
    !Number.isFinite(infants) || infants < 0 || infants > 40
  ) {
    return NextResponse.json({ error: "Please provide a valid traveller breakdown (adults, children, infants)." }, { status: 400 });
  }
  if (adults + children + infants !== guests) {
    return NextResponse.json({ error: "Traveller breakdown must add up to the total number of guests." }, { status: 400 });
  }
  if (body.dateOfBirth && !isDate(body.dateOfBirth)) {
    return NextResponse.json({ error: "Please provide a valid date of birth." }, { status: 400 });
  }
  if (body.passportExpiry && !isDate(body.passportExpiry)) {
    return NextResponse.json({ error: "Please provide a valid passport expiry date." }, { status: 400 });
  }
  if (new Date(body.checkOut) <= new Date(body.checkIn)) {
    return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  }

  // Bookings are saved as requests; the team confirms availability later.
  const createdId = await createBooking({
    name: text(body.name)!,
    email: text(body.email)!.toLowerCase(),
    phone: text(body.phone)!,
    nationality: text(body.nationality) ?? "Indian",
    dateOfBirth: body.dateOfBirth || undefined,
    gender: text(body.gender),
    adults,
    children,
    infants,
    guests,
    checkIn: body.checkIn!,
    checkOut: body.checkOut!,
    packageTitle: text(body.packageTitle)!,
    packageType: text(body.packageType) ?? "General",
    destination: text(body.destination) ?? "Worldwide",
    departureCity: text(body.departureCity) ?? "Delhi",
    travelMode: text(body.travelMode) ?? text(body.flightClass),
    flightClass: text(body.flightClass) ?? text(body.travelMode),
    hotelStar: text(body.hotelStar),
    roomType: text(body.roomType),
    estimatedFare: Number.isFinite(Number(body.estimatedFare)) ? Number(body.estimatedFare) : undefined,
    dietaryRequirements: text(body.dietaryRequirements),
    mealPreference: text(body.mealPreference),
    passportNumber: text(body.passportNumber),
    passportExpiry: body.passportExpiry || undefined,
    passportIssuingCountry: text(body.passportIssuingCountry),
    emergencyContactName: text(body.emergencyContactName),
    emergencyContactPhone: text(body.emergencyContactPhone),
    specialRequests: text(body.specialRequests),
    notes: text(body.notes),
  } satisfies Omit<Booking, "id" | "createdAt" | "status">);

  return NextResponse.json({ ok: true, id: createdId }, { status: 201 });
}