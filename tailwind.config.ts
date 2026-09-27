import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#FFFFFF",
        "bg-dark": "#0B0F0D",
        "accent-green": "#B6FF3C",
        "text-primary": "#0B0F0D",
        "text-muted": "#6B7280",
        "border-subtle": "rgba(0,0,0,0.08)",
      },
      backgroundColor: {
        "surface-glass": "rgba(255,255,255,0.85)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        floating: "0 20px 60px rgba(0,0,0,0.12)",
      },
      transitionTimingFunction: {
        "power3-out": "cubic-bezier(0.215, 0.61, 0.355, 1)",
        "power4-inOut": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
