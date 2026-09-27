import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/lib/lenis-provider";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth-context";
import Preloader from "@/components/preloader";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Movade — Explore the World, One Journey at a Time",
  description:
    "Our travel agency offers personalized and hassle-free travel experiences, tailored to meet your unique preferences and needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} font-body antialiased bg-bg-primary text-text-primary`}
      >
        <AuthProvider>
          <ToastProvider>
            <Preloader>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
            </Preloader>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
