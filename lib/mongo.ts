import { MongoClient, Db } from "mongodb";

/**
 * MongoDB client singleton (server-only).
 * Uses a global cache so dev HMR / serverless warm starts reuse one connection.
 * When MONGODB_URI is unset the app falls back to the local JSON store
 * (see lib/repo.ts) — local dev keeps working with zero config.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "movade";

export function isMongoEnabled(): boolean {
  return !!uri && !uri.includes("your_");
}

function mongoMisconfigured(): Error {
  return new Error(
    "MongoDB is not configured. Set MONGODB_URI (and optionally MONGODB_DB) " +
      "in .env.local — see .env.example. Without it the app uses the local " +
      "JSON store, which is dev-only and does not persist on serverless hosts."
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __movadeMongoClient: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri || uri.includes("your_")) throw mongoMisconfigured();
  if (!globalThis.__movadeMongoClient) {
    const client = new MongoClient(uri);
    globalThis.__movadeMongoClient = client.connect();
  }
  return globalThis.__movadeMongoClient;
}

let indexesEnsured = false;

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  const db = client.db(dbName);
  if (!indexesEnsured) {
    try {
      await Promise.all([
        db.collection("users").createIndex({ email: 1 }, { unique: true }),
        db.collection("users").createIndex({ id: 1 }, { unique: true }),
        db.collection("bookings").createIndex({ id: 1 }, { unique: true }),
        db.collection("bookings").createIndex({ email: 1 }),
        db
          .collection("subscribers")
          .createIndex({ email: 1 }, { unique: true }),
        db.collection("consultations").createIndex({ email: 1 }),
        db
          .collection("password_resets")
          .createIndex({ tokenHash: 1 }, { unique: true }),
        db.collection("password_resets").createIndex({ userId: 1 }),
        db.collection("password_resets").createIndex({ expiresAt: 1 }),
        db.collection("otp_codes").createIndex({ identifier: 1 }),
        db.collection("otp_codes").createIndex({ expiresAt: 1 }),
        db.collection("users").createIndex({ phone: 1 }, { sparse: true }),
      ]);
      indexesEnsured = true;
    } catch {
      // Index creation can fail on restricted DB roles — retry next call.
      indexesEnsured = false;
    }
  }
  return db;
}

/** True when err is a duplicate-key violation (unique index). */
export function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === 11000
  );
}
