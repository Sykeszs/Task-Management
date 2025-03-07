import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customColor1: "#319B79",
        customColor2: "#26735B",
        customColor3: "#1A4C3C",
        customColor4: "#0d261E",
      },
    },
  },
  plugins: [],
} satisfies Config;
