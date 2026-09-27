import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore } from "@/lib/db";
import type { Testimonial } from "@/lib/types";

const MIN_SPACING = 92;
const MAX_X = 420;
const MAX_Y = 170;

function findFreePosition(existing: Pick<Testimonial, "x" | "y">[]): {
  x: number;
  y: number;
} {
  const taken = existing.map((t) => ({ x: t.x, y: t.y }));
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  const clear = (x: number, y: number) =>
    taken.every((t) => Math.hypot(t.x - x, t.y - y) >= MIN_SPACING);

  for (let slot = 0; slot < 10000; slot++) {
    const radius = 135 + Math.floor(slot / 9) * 18;
    const x = Math.round(Math.cos(slot * goldenAngle) * radius);
    const y = Math.round(Math.sin(slot * goldenAngle) * radius);
    if (clear(x, y) && Math.abs(x) <= MAX_X && Math.abs(y) <= MAX_Y) {
      return { x, y };
    }
  }

  for (let slot = 0; slot < 10000; slot++) {
    const radius = 135 + Math.floor(slot / 9) * 18;
    const x = Math.round(Math.cos(slot * goldenAngle) * radius);
    const y = Math.round(Math.sin(slot * goldenAngle) * radius);
    if (clear(x, y)) {
      return { x, y };
    }
  }

  return { x: 0, y: -170 };
}

export async function GET() {
  const store = await getStore();
  return NextResponse.json({ testimonials: store.testimonials });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    role?: string;
    quote?: string;
  } | null;

  if (!body || !body.name?.trim() || !body.quote?.trim()) {
    return NextResponse.json(
      { error: "Your name and a short review are required." },
      { status: 400 }
    );
  }
  if (body.quote.trim().length < 10) {
    return NextResponse.json(
      { error: "Please write at least 10 characters for your review." },
      { status: 400 }
    );
  }

  await updateStore(async (data) => {
    const pos = findFreePosition(data.testimonials);
    const testimonial: Testimonial = {
      id: Math.max(0, ...data.testimonials.map((t) => t.id)) + 1,
      name: body.name!.trim(),
      role: body.role?.trim() || "New Traveler",
      quote: body.quote!.trim(),
      photo: "/review/20303b5f6f2cf43506bb6d88e4ad0d93.jpg",
      x: pos.x,
      y: pos.y,
      objectPos: "50% 20%",
      duration: 7,
    };
    data.testimonials.push(testimonial);
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}