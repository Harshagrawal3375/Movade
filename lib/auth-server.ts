import { createHmac, createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { PublicUser, User } from "@/lib/types";
import { findUserById } from "@/lib/repo";

const SESSION_COOKIE = "movade_session";
const DEV_FALLBACK_SECRET = "movade-dev-secret-change-me";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === DEV_FALLBACK_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET is missing or insecure. Set a 32+ char secret in production (see .env.example)."
      );
    }
    return DEV_FALLBACK_SECRET;
  }
  return secret;
}

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf-8");
}

export function hashPassword(password: string, salt?: string): {
  salt: string;
  hash: string;
} {
  const s = salt ?? randomBytes(16).toString("hex");
  const hash = scryptSync(password, s, 64).toString("hex");
  return { salt: s, hash };
}

export function verifyPassword(password: string, user: User): boolean {
  const { salt, passwordHash } = user;
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(passwordHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

interface SessionPayload {
  uid: string;
  exp: number;
}

function sign(payload: SessionPayload): string {
  const body = base64UrlEncode(JSON.stringify(payload));
  const sig = createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token: string): SessionPayload | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = createHmac("sha256", getSecret()).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export function createSessionToken(uid: string): string {
  return sign({ uid, exp: Date.now() + SESSION_TTL_MS });
}

export function setSessionCookie(token: string): void {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verify(token);
  if (!payload) return null;
  const user = await findUserById(payload.uid);
  if (!user) return null;
  return serializeUser(user);
}

export function serializeUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    // Users created before verification existed have no flag → treat as verified.
    emailVerified: user.emailVerified ?? true,
    phoneVerified: user.phoneVerified ?? false,
  };
}

// ── Password reset tokens (single-use, 1h expiry, sha256-hashed at rest) ──

export const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

export function createResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: hashResetToken(token) };
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}