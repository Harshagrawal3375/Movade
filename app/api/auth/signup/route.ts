import { NextRequest, NextResponse } from "next/server";
import { getStore, updateStore } from "@/lib/db";
import {
  hashPassword,
  setSessionCookie,
  createSessionToken,
  serializeUser,
} from "@/lib/auth-server";
import type { User } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!name) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password should be at least 6 characters." },
      { status: 400 }
    );
  }

  const store = await getStore();
  if (store.users.some((u) => u.email === email)) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const created = await (async () => {
    const { salt, hash } = hashPassword(password);
    const user: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email: email!,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    };
    await updateStore((data) => {
      data.users.push(user);
    });
    return user;
  })();

  setSessionCookie(createSessionToken(created.id));
  return NextResponse.json({ user: serializeUser(created) }, { status: 201 });
}