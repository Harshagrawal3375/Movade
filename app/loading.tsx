export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-text-muted border-t-text-primary" />
        <p className="text-sm text-text-muted">Loading your journey…</p>
      </div>
    </main>
  );
}
