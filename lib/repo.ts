import { randomBytes } from "node:crypto";
import { getDb, isDuplicateKeyError, isMongoEnabled } from "@/lib/mongo";
import { getSeedTestimonials, getStore, updateStore } from "@/lib/db";
import type {
  Booking,
  Consultation,
  Subscriber,
  Testimonial,
  User,
  PasswordResetToken,
  OtpCode,
} from "@/lib/types";

/**
 * Repository for mutable collections (users, bookings, consultations,
 * subscribers, user-added testimonials).
 *
 * MongoDB when MONGODB_URI is set, local JSON store otherwise — so local
 * dev works with zero config while prod persists on serverless hosts.
 * Static catalog data (destinations, properties, spots, blogs) stays in
 * code (lib/db.ts seed) and is NOT duplicated into the database.
 */

/** Collision-free id without a read-modify-write round trip. */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${randomBytes(4).toString(
    "hex"
  )}`;
}

function stripId<T>(doc: T & { _id?: unknown }): T {
  const { _id: _ignored, ...rest } = doc;
  void _ignored;
  return rest as T;
}

// ── Users ────────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<User | null> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const doc = await db.collection<User>("users").findOne({ email });
    return doc ? stripId(doc) : null;
  }
  const store = await getStore();
  return store.users.find((u) => u.email === email) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const doc = await db.collection<User>("users").findOne({ id });
    return doc ? stripId(doc) : null;
  }
  const store = await getStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const doc = await db.collection<User>("users").findOne({ phone });
    return doc ? stripId(doc) : null;
  }
  const store = await getStore();
  return store.users.find((u) => u.phone === phone) ?? null;
}

export async function markEmailVerified(userId: string): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<User>("users")
      .updateOne({ id: userId }, { $set: { emailVerified: true } });
    return;
  }
  await updateStore((data) => {
    const u = data.users.find((x) => x.id === userId);
    if (u) u.emailVerified = true;
  });
}

export async function markPhoneVerified(
  userId: string,
  phone: string
): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<User>("users")
      .updateOne(
        { id: userId },
        { $set: { phoneVerified: true, phone } }
      );
    return;
  }
  await updateStore((data) => {
    const u = data.users.find((x) => x.id === userId);
    if (u) {
      u.phoneVerified = true;
      u.phone = phone;
    }
  });
}

// ── OTP codes ────────────────────────────────────────────────────────────

export async function listRecentOtps(
  identifier: string,
  sinceIso: string
): Promise<OtpCode[]> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const docs = await db
      .collection<OtpCode>("otp_codes")
      .find({ identifier, createdAt: { $gte: sinceIso } })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(stripId);
  }
  const store = await getStore();
  return store.otpCodes.filter(
    (o) => o.identifier === identifier && o.createdAt >= sinceIso
  );
}

export async function findLatestOtp(
  identifier: string,
  purpose?: OtpCode["purpose"]
): Promise<OtpCode | null> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const query: Record<string, unknown> = { identifier };
    if (purpose) query.purpose = purpose;
    const docs = await db
      .collection<OtpCode>("otp_codes")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    return docs.length ? stripId(docs[0]) : null;
  }
  const store = await getStore();
  const matches = store.otpCodes
    .filter((o) => o.identifier === identifier && (!purpose || o.purpose === purpose))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return matches[0] ?? null;
}

export async function saveOtp(code: OtpCode): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    // One active code per identifier+purpose: replace older ones.
    await db
      .collection<OtpCode>("otp_codes")
      .deleteMany({ identifier: code.identifier, purpose: code.purpose });
    await db.collection<OtpCode>("otp_codes").insertOne(code);
    return;
  }
  await updateStore((data) => {
    data.otpCodes = data.otpCodes.filter(
      (o) => !(o.identifier === code.identifier && o.purpose === code.purpose)
    );
    data.otpCodes.push(code);
  });
}

export async function incrementOtpAttempts(id: string): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<OtpCode>("otp_codes")
      .updateOne({ id }, { $inc: { attempts: 1 } });
    return;
  }
  await updateStore((data) => {
    const o = data.otpCodes.find((x) => x.id === id);
    if (o) o.attempts += 1;
  });
}

export async function deleteOtp(id: string): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection<OtpCode>("otp_codes").deleteOne({ id });
    return;
  }
  await updateStore((data) => {
    data.otpCodes = data.otpCodes.filter((o) => o.id !== id);
  });
}

export async function deleteExpiredOtps(): Promise<void> {
  const now = new Date().toISOString();
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<OtpCode>("otp_codes")
      .deleteMany({ expiresAt: { $lt: now } });
    return;
  }
  await updateStore((data) => {
    data.otpCodes = data.otpCodes.filter((o) => o.expiresAt >= now);
  });
}

/** Throws a "duplicate" error when the email is taken (also on races). */
export async function createUser(user: User): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    try {
      await db.collection<User>("users").insertOne(user);
    } catch (err) {
      if (isDuplicateKeyError(err)) throw new Error("duplicate");
      throw err;
    }
    return;
  }
  await updateStore((data) => {
    if (data.users.some((u) => u.email === user.email)) {
      throw new Error("duplicate");
    }
    data.users.push(user);
  });
}

// ── Password reset ───────────────────────────────────────────────────────

export async function updateUserPassword(
  userId: string,
  salt: string,
  passwordHash: string
): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<User>("users")
      .updateOne({ id: userId }, { $set: { salt, passwordHash } });
    return;
  }
  await updateStore((data) => {
    const u = data.users.find((x) => x.id === userId);
    if (u) {
      u.salt = salt;
      u.passwordHash = passwordHash;
    }
  });
}

export async function createPasswordReset(
  token: PasswordResetToken
): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection<PasswordResetToken>("password_resets").insertOne(token);
    return;
  }
  await updateStore((data) => {
    data.passwordResets.push(token);
  });
}

export async function findPasswordResetByHash(
  tokenHash: string
): Promise<PasswordResetToken | null> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const doc = await db
      .collection<PasswordResetToken>("password_resets")
      .findOne({ tokenHash });
    return doc ? stripId(doc) : null;
  }
  const store = await getStore();
  return store.passwordResets.find((t) => t.tokenHash === tokenHash) ?? null;
}

export async function deletePasswordReset(id: string): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection<PasswordResetToken>("password_resets").deleteOne({ id });
    return;
  }
  await updateStore((data) => {
    data.passwordResets = data.passwordResets.filter((t) => t.id !== id);
  });
}

export async function deletePasswordResetsForUser(
  userId: string
): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<PasswordResetToken>("password_resets")
      .deleteMany({ userId });
    return;
  }
  await updateStore((data) => {
    data.passwordResets = data.passwordResets.filter(
      (t) => t.userId !== userId
    );
  });
}

export async function deleteExpiredPasswordResets(): Promise<void> {
  const now = new Date().toISOString();
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection<PasswordResetToken>("password_resets")
      .deleteMany({ expiresAt: { $lt: now } });
    return;
  }
  await updateStore((data) => {
    data.passwordResets = data.passwordResets.filter(
      (t) => t.expiresAt >= now
    );
  });
}

// ── Bookings ─────────────────────────────────────────────────────────────

export async function findBookingsByEmail(email: string): Promise<Booking[]> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const docs = await db
      .collection<Booking>("bookings")
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(stripId);
  }
  const store = await getStore();
  return store.bookings.filter(
    (b) => b.email.toLowerCase() === email.toLowerCase()
  );
}

export async function findBookingById(id: string): Promise<Booking | null> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const doc = await db.collection<Booking>("bookings").findOne({ id });
    return doc ? stripId(doc) : null;
  }
  const store = await getStore();
  return store.bookings.find((b) => b.id === id) ?? null;
}

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">
): Promise<string> {
  const booking: Booking = {
    ...input,
    id: newId("bk"),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection<Booking>("bookings").insertOne(booking);
    return booking.id;
  }
  await updateStore((data) => {
    data.bookings.push(booking);
  });
  return booking.id;
}

// ── Consultations ────────────────────────────────────────────────────────

export async function listConsultations(): Promise<Consultation[]> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const docs = await db
      .collection<Consultation>("consultations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map(stripId);
  }
  const store = await getStore();
  return store.consultations;
}

export async function createConsultation(
  input: Omit<Consultation, "id" | "createdAt" | "status">
): Promise<string> {
  const consultation: Consultation = {
    ...input,
    id: newId("cs"),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection<Consultation>("consultations").insertOne(consultation);
    return consultation.id;
  }
  await updateStore((data) => {
    data.consultations.push(consultation);
  });
  return consultation.id;
}

// ── Subscribers ──────────────────────────────────────────────────────────

export async function listSubscribers(): Promise<Subscriber[]> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const docs = await db.collection<Subscriber>("subscribers").find({}).toArray();
    return docs.map(stripId);
  }
  const store = await getStore();
  return store.subscribers;
}

export async function createSubscriber(
  email: string
): Promise<{ already: boolean }> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const subscriber: Subscriber = {
      id: newId("sub"),
      email,
      createdAt: new Date().toISOString(),
    };
    try {
      await db.collection<Subscriber>("subscribers").insertOne(subscriber);
      return { already: false };
    } catch (err) {
      if (isDuplicateKeyError(err)) return { already: true };
      throw err;
    }
  }
  let already = false;
  await updateStore((data) => {
    if (data.subscribers.some((s) => s.email === email)) {
      already = true;
      return;
    }
    data.subscribers.push({
      id: newId("sub"),
      email,
      createdAt: new Date().toISOString(),
    });
  });
  return { already };
}

// ── Testimonials ─────────────────────────────────────────────────────────
// Seed testimonials ship in code; only user-added ones live in the store.

export async function listTestimonials(): Promise<Testimonial[]> {
  if (isMongoEnabled()) {
    const db = await getDb();
    const docs = await db.collection<Testimonial>("testimonials").find({}).toArray();
    return [...getSeedTestimonials(), ...docs.map(stripId)];
  }
  const store = await getStore();
  return store.testimonials;
}

export async function createTestimonial(t: Testimonial): Promise<void> {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection<Testimonial>("testimonials").insertOne(t);
    return;
  }
  await updateStore((data) => {
    data.testimonials.push(t);
  });
}
