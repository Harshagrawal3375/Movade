import { NextRequest, NextResponse } from "next/server";
import { createSubscriber, listSubscribers } from "@/lib/repo";
import { getCurrentUser } from "@/lib/auth-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const subscribers = await listSubscribers();
  return NextResponse.json({ subscribers });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const { already } = await createSubscriber(email);
  if (already) {
    return NextResponse.json({ ok: true, already: true }, { status: 200 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
