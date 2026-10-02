# Movade — Travel Agency (Next.js 14)

Personalized travel booking site: destinations, properties, experiences,
booking requests, consultations, testimonials.

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
| `MONGODB_URI` / `MONGODB_DB` | Yes in prod (MongoDB Atlas) | https://cloud.mongodb.com → Connect → Drivers → Node.js |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Yes for forgot-password emails | Any SMTP server. Gmail: `smtp.gmail.com:587` + an [App Password](https://myaccount.google.com/apppasswords) (regular Gmail passwords don't work) |

Without SMTP configured, forgot-password still works locally: the reset link
is logged server-side and shown in the UI in dev only.

Without Firebase keys the app falls back to the built-in cookie auth.
Without `MONGODB_URI` the app uses the local JSON store (`data/app-data.json`,
gitignored) — fine for local dev, does not persist on serverless hosts.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Data store

Mutable data (users, bookings, consultations, subscribers, user testimonials)
lives in MongoDB when `MONGODB_URI` is set, otherwise in `data/app-data.json`
(local dev only — gitignored, no cross-instance persistence). Static catalog
(destinations, properties, spots, blogs, seed testimonials) ships in code
(`lib/db.ts`). Repository: `lib/repo.ts`, client: `lib/mongo.ts`.

## Security notes

- `GET /api/bookings` requires login and returns only the caller's own bookings.
- `AUTH_SECRET` must be set in production or the server throws on boot.
- Security headers (`nosniff`, `DENY`, `Referrer-Policy`) in `next.config.mjs`.

## Project layout

- `app/` — routes + `not-found/error/loading/robots/sitemap/manifest`
- `components/` — landing sections, booking forms, modals
- `lib/` — `db`, `repo`, `mongo`, `auth-server`, `firebase`, `api` client
- `data/` — runtime JSON store (local only, ignored by git)
- `public/` — images, preloader video
