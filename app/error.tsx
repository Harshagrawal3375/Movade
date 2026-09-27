"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary px-6 text-center">
      <p className="font-display text-sm tracking-[0.3em] uppercase text-text-muted">
        Something broke
      </p>
      <h1 className="font-display text-4xl font-bold mt-4">
        The trail hit a rough patch.
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-bg-dark text-white px-8 py-3 font-medium hover:opacity-90"
      >
        Try again
      </button>
    </main>
  );
}
