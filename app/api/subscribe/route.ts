import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore, nextId } from "@/lib/db";
import type { Subscriber } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const store = await getStore();
  return NextResponse.json({ subscribers: store.subscribers });
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

  const store = await getStore();
  if (store.subscribers.some((s) => s.email === email)) {
    return NextResponse.json({ ok: true, already: true }, { status: 200 });
  }

  await updateStore(async (data) => {
    const subscriber: Subscriber = {
      id: await nextId(data.subscribers, "sub"),
      email: email!,
      createdAt: new Date().toISOString(),
    };
    data.subscribers.push(subscriber);
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}