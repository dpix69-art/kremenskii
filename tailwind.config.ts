import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "type-h1": ["var(--type-h1)", { lineHeight: "1.2", fontWeight: "600" }],
        "type-h2": ["var(--type-h2)", { lineHeight: "1.25", fontWeight: "600" }],
        "type-h3": ["var(--type-h3)", { lineHeight: "1.35", fontWeight: "600" }],
        "type-body": ["var(--type-body)", { lineHeight: "1.65", fontWeight: "400" }],
        "type-small": ["var(--type-small)", { lineHeight: "1.4", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
