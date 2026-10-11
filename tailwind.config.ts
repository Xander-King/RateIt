import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        haze: "#7c8a99",
        noir: {
          950: "#05060a",
          900: "#0b0e16",
          800: "#141a24",
          700: "#1f2733",
        },
        neon: {
          cyan: "#25e6ff",
          pink: "#ff2f92",
          amber: "#ffb02e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
