export function getAuthErrorMessage(error: unknown): string {
  const err = error as { code?: string; message?: string };
  const code = err?.code;

  const messages: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/operation-not-allowed": "This sign-in method is disabled.",
  };

  if (code && messages[code]) return messages[code];

  if (err?.message && !err.message.startsWith("Failed to fetch")) {
    return err.message;
  }

  return "Something went wrong. Please try again.";
}