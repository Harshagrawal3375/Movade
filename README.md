# Movade — Travel Agency (Next.js 14)

Personalized travel booking site: destinations, properties, experiences,
bookings with Razorpay (reserve-then-pay), consultations, testimonials.

## Quick start

```bash
cp .env.example .env.local   # fill in secrets, see below
npm install
npm run dev                  # http://localhost:3000
```

## Env vars (`.env.local`, never commit)

| Key | Required | Where to get it |
|---|---|---|
| `AUTH_SECRET` | Yes in prod | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | For sitemap/robots | Your deployed URL, e.g. `https://movade.example.com` |
| `NEXT_PUBLIC_FIREBASE_*` | Optional (Firebase auth path) | Firebase Console → Project Settings → Your apps |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional (payments) | Razorpay Dashboard → Settings → API Keys (Test Mode) |

Without Firebase keys the app falls back to the built-in cookie auth.
Without Razorpay keys `/api/payments/*` returns `503` with setup instructions.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Data store (current limitation)

`lib/db.ts` uses `data/app-data.json` (gitignored) with seed data in code.
Works for local dev only — it is **not safe for serverless / multi-instance
prod** (read-only FS, read-modify-write races). Next step: migrate to
Postgres/Mongo/Firestore + Prisma/Drizzle. See `lib/db.ts:625`.

## Security notes

- `GET /api/bookings` requires login and returns only the caller's own bookings.
- `AUTH_SECRET` must be set in production or the server throws on boot.
- Razorpay webhook/signature uses `timingSafeEqual`; booking flips
  `pending → confirmed` only after signature verification.
- Security headers (`nosniff`, `DENY`, `Referrer-Policy`) in `next.config.mjs`.

## Project layout

- `app/` — routes + `not-found/error/loading/robots/sitemap/manifest`
- `components/` — landing sections, booking forms, modals
- `lib/` — `db`, `auth-server`, `firebase`, `razorpay`, `api` client
- `data/` — runtime JSON store (local only, ignored by git)
- `public/` — images, preloader video
