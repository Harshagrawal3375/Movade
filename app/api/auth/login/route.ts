import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import {
  setSessionCookie,
  createSessionToken,
  verifyPassword,
  serializeUser,
} from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const store = await getStore();
  const user = store.users.find((u) => u.email === email);

  if (!user || !verifyPassword(password, user)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  setSessionCookie(createSessionToken(user.id));
  return NextResponse.json({ user: serializeUser(user) });
}