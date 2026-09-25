import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leo: {
          blue: "#0B2239",
          "blue-hover": "#071A2B",
          dark: "#050E1A",
          navy: "#0B2239",
          "navy-deep": "#071A2B",
          cyan: "#22D3EE",
          "cyan-hover": "#0EA5E9",
          "cyan-bright": "#67E8F9",
          "cyan-light": "#E0F7FF",
          ice: "#BAE6FD",
          gold: "#7F1D2D",
          maroon: "#7F1D2D",
          "maroon-deep": "#991B1B",
          "gold-light": "#FBEAEC",
          pearl: "#F1F5F9",
          "pearl-dark": "#E2E8F0",
          charcoal: "#111827",
          slate: "#5A6578",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "Outfit", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        "card-lg": "24px",
      },
      boxShadow: {
        card: "0 10px 30px -5px rgba(11, 34, 57, 0.10), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 20px 40px -5px rgba(11, 34, 57, 0.18), 0 8px 16px -4px rgba(0, 0, 0, 0.06)",
        glow: "0 0 25px rgba(34, 211, 238, 0.4)",
        "glow-cyan": "0 8px 24px -4px rgba(34, 211, 238, 0.45), 0 0 0 1px rgba(34, 211, 238, 0.25)",
        "glow-cyan-lg": "0 12px 36px -4px rgba(34, 211, 238, 0.65), 0 0 0 1px rgba(34, 211, 238, 0.4)",
        "glow-cyan-soft": "0 0 40px rgba(34, 211, 238, 0.18)",
        "glow-maroon-subtle": "0 4px 16px -2px rgba(127, 29, 45, 0.25)",
        "glass": "0 8px 32px -8px rgba(7, 26, 43, 0.35), inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
