import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary px-6 text-center">
      <p className="font-display text-sm tracking-[0.3em] uppercase text-text-muted">
        404 — Lost somewhere
      </p>
      <h1 className="font-display text-5xl font-bold mt-4">
        This route went off the map.
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        The page you are looking for does not exist or was moved. Let&apos;s get
        you back to the journey.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-bg-dark text-white px-8 py-3 font-medium hover:opacity-90"
      >
        Back home
      </Link>
    </main>
  );
}
