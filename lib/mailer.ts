import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * SMTP mailer (server-only). Configured via env:
 *   SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS,
 *   SMTP_FROM (e.g. "Movade <no-reply@example.com>"),
 *   SMTP_SECURE ("true" for port 465, otherwise STARTTLS on 587).
 *
 * Gmail: use host smtp.gmail.com, port 587, and an App Password
 * (Google Account → Security → 2-Step Verification → App passwords).
 */

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;
  const from = process.env.SMTP_FROM ?? `Movade <${user}>`;

  return { host, port, secure, user, pass, from };
}

export function isMailerConfigured(): boolean {
  return getSmtpConfig() !== null;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const config = getSmtpConfig();
  if (!config) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return transporter;
}

/** Send a 6-digit verification code. Returns false when SMTP isn't configured. */
export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const config = getSmtpConfig();
  const transport = getTransporter();
  if (!config || !transport) return false;

  await transport.sendMail({
    from: config.from,
    to,
    subject: `Your Movade verification code: ${code}`,
    text: [
      `Your Movade verification code is ${code}.`,
      "",
      "It expires in 10 minutes. If you didn't request this, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0B0F0D;">
        <h2>Your verification code</h2>
        <p>Enter this code to verify your Movade account. It expires in 10 minutes.</p>
        <p style="font-size: 32px; font-weight: 800; letter-spacing: 8px; background: #f4f6f0; border-radius: 12px; padding: 16px; text-align: center;">${code}</p>
        <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
  return true;
}
/** Send the password-reset email. Returns false when SMTP isn't configured. */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<boolean> {
  const config = getSmtpConfig();
  const transport = getTransporter();
  if (!config || !transport) return false;

  await transport.sendMail({
    from: config.from,
    to,
    subject: "Reset your Movade password",
    text: [
      "You requested a password reset for your Movade account.",
      "",
      `Reset your password (expires in 1 hour): ${resetUrl}`,
      "",
      "If you didn't request this, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0B0F0D;">
        <h2>Reset your Movade password</h2>
        <p>You requested a password reset for your Movade account. Click the button below — the link expires in 1 hour.</p>
        <p><a href="${resetUrl}" style="display: inline-block; background: #B8E62E; color: #0B0F0D; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 999px;">Reset password</a></p>
        <p style="color: #666; font-size: 13px;">Or paste this link into your browser:<br /><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
  return true;
}
