import { NextRequest, NextResponse } from "next/server";
import {
  deletePasswordReset,
  deletePasswordResetsForUser,
  findPasswordResetByHash,
  findUserById,
  updateUserPassword,
} from "@/lib/repo";
import { hashPassword, hashResetToken } from "@/lib/auth-server";

/** GET /api/auth/reset-password?token=… — pre-validate a link before showing the form. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  const record = await findPasswordResetByHash(hashResetToken(token));
  if (!record || record.expiresAt < new Date().toISOString()) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  return NextResponse.json({ valid: true });
}

/**
 * POST /api/auth/reset-password { token, password }
 * Single-use token: on success the password is updated and all tokens
 * for that user are revoked.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    password?: string;
  } | null;

  const token = body?.token?.trim();
  const password = body?.password ?? "";

  if (!token) {
    return NextResponse.json(
      { error: "Reset link is missing or invalid." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password should be at least 6 characters." },
      { status: 400 }
    );
  }

  const record = await findPasswordResetByHash(hashResetToken(token));

  if (!record || record.expiresAt < new Date().toISOString()) {
    if (record) await deletePasswordReset(record.id).catch(() => {});
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const user = await findUserById(record.userId);
  if (!user) {
    await deletePasswordReset(record.id).catch(() => {});
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const { salt, hash } = hashPassword(password);
  await updateUserPassword(user.id, salt, hash);
  await deletePasswordResetsForUser(user.id).catch(() => {});

  return NextResponse.json({ ok: true });
}
