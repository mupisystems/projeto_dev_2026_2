import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#0a0a0a", paper: "#fafafa", fog: "#6b6b6b", panel: "#141414" },
      letterSpacing: { widest: ".22em" },
    },
  },
  plugins: [],
};

export default config;
