import { NextRequest, NextResponse } from "next/server";
import { createConsultation, listConsultations } from "@/lib/repo";
import { getCurrentUser } from "@/lib/auth-server";
import type { Consultation } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const consultations = await listConsultations();
  return NextResponse.json({ consultations });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<Consultation> | null;

  if (!body || !body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!body.email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!body.destination?.trim()) {
    return NextResponse.json({ error: "Please tell us where you'd like to go." }, { status: 400 });
  }
  if (!body.budget?.trim()) {
    return NextResponse.json({ error: "Please share a rough budget." }, { status: 400 });
  }

  await createConsultation({
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    phone: body.phone?.trim() || undefined,
    destination: body.destination!.trim(),
    budget: body.budget!.trim(),
    message: body.message?.trim() || undefined,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
