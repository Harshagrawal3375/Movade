import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore, nextId } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";
import type { Booking } from "@/lib/types";

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const store = await getStore();
  const mine = store.bookings.filter(
    (b) => b.email.toLowerCase() === user.email.toLowerCase()
  );
  return NextResponse.json({ bookings: mine });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<Booking> | null;

  if (!body || !body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!body.email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!body.packageTitle?.trim()) {
    return NextResponse.json({ error: "Missing package information." }, { status: 400 });
  }
  if (!body.phone?.trim()) {
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

  const createdId = await (async () => {
    const store = await getStore();
    const id = await nextId(store.bookings, "bk");
    const booking: Booking = {
      id,
      name: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      phone: body.phone!.trim(),
      nationality: body.nationality!.trim(),
      dateOfBirth: body.dateOfBirth || undefined,
      gender: body.gender?.trim() || undefined,
      adults,
      children,
      infants,
      guests,
      checkIn: body.checkIn!,
      checkOut: body.checkOut!,
      packageTitle: body.packageTitle!.trim(),
      packageType: body.packageType?.trim() || "General",
      destination: body.destination?.trim() || "Worldwide",
      departureCity: body.departureCity?.trim() || "Delhi",
      travelMode: body.travelMode?.trim() || body.flightClass?.trim() || undefined,
      flightClass: body.flightClass?.trim() || body.travelMode?.trim() || undefined,
      hotelStar: body.hotelStar?.trim() || undefined,
      roomType: body.roomType?.trim() || undefined,
      estimatedFare: Number.isFinite(Number(body.estimatedFare)) ? Number(body.estimatedFare) : undefined,
      dietaryRequirements: body.dietaryRequirements?.trim() || undefined,
      mealPreference: body.mealPreference?.trim() || undefined,
      passportNumber: body.passportNumber?.trim() || undefined,
      passportExpiry: body.passportExpiry || undefined,
      passportIssuingCountry: body.passportIssuingCountry?.trim() || undefined,
      emergencyContactName: body.emergencyContactName?.trim() || undefined,
      emergencyContactPhone: body.emergencyContactPhone?.trim() || undefined,
      specialRequests: body.specialRequests?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      // Reserve-then-pay: booking starts as pending, flips to
      // confirmed after Razorpay payment verification.
      status: "pending",
    };
    await updateStore((data) => {
      data.bookings.push(booking);
    });
    return id;
  })();

  return NextResponse.json({ ok: true, id: createdId }, { status: 201 });
}