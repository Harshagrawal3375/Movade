export function getAuthErrorMessage(error: unknown): string {
  const err = error as { code?: string; message?: string };

  if (err?.message && !err.message.startsWith("Failed to fetch")) {
    return err.message;
  }

  return "Something went wrong. Please try again.";
}
