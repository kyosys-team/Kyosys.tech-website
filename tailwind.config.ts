import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Kyosys brand system — emotional psychology spec (2026-09-28) ─────
      // These tokens are the ONLY brand colors in the app. Do not hardcode
      // hex values in components; use these classes instead.
      //
      //  brand-*  deep blue & slate  → stability, enterprise authority
      //                              (identity, headers, structure, nav)
      //  sun-*    warm amber         → energy, urgency (marquee, kickers,
      //                              cursor dot, selection states — NEVER
      //                              body text on light: fails contrast)
      //  emerald  growth green       → conversion CTAs on DARK sections ONLY
      //                              (#10B981 bg + #0B0F19 text: 7.55:1.
      //                              Spec's white text fails at 2.54:1 —
      //                              dark text used deliberately.)
      //  paper/ink  neutral slate    → canvas + typography (Palette 3 light)
      //  indigo/violet (Tailwind built-ins: indigo-500 #6366F1,
      //  violet-600 #7C3AED) → technical sophistication: feature badges,
      //  hero highlights, glows, gradient borders.
      //  Tech badges (React, Node.js…) stay NEUTRAL per the Single-Button
      //  Rule: never emerald/amber on tech tags.
      colors: {
        brand: {
          950: "#0B0F19", // Palette 1 canvas — footer bg, dark sections
          900: "#1E40AF", // deep blue — primary identity, headings on light
          800: "#1E3A8A", // dark blue — gradient mid-stop (immersive sections)
          700: "#1D4ED8", // blue-700 — hover states, accents
          500: "#2563EB", // cobalt — links, icons, focus rings
        },
        sun: {
          300: "#FCD34D", // amber-300 — warm gradient top, gradient text on dark
          400: "#F59E0B", // amber-500 — primary warm accent
          500: "#EA580C", // tangerine — warm gradient bottom, deep accents
        },
        emerald: {
          500: "#10B981", // conversion CTA bg on dark sections
          600: "#059669", // conversion CTA hover/deep
        },
        paper: "#FFFFFF", // Palette 3 canvas
        mist: "#F8FAFC", // alt section bg, cards
        ink: "#0F172A", // primary text — ALSO light-section CTA bg (inverted)
        "ink-soft": "#64748B", // secondary text (4.76:1 on white)
        danger: "#C0392B", // errors only
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        // Italic serif — accent words inside headlines ONLY (editorial trick).
        // Never for body text, buttons, or UI chrome.
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // Testimonial auto-advance progress bar (6s cycle, scaleX 0 → 1)
        progress: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        // Slow ambient drift for aurora blobs — transform-only, GPU cheap
        aurora: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(6%, -10%, 0) scale(1.18)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        progress: "progress 6s linear forwards",
        aurora: "aurora 24s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
