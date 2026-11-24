import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ds: {
          sidebar:        "#000000",
          nav:            "#000000",
          bg:             "#000000",
          surface:        "#0A0A0A",
          elevated:       "#111111",
          "table-header": "#141414",
          text:           "#F5EDE8",
          "text-2":       "#9A8880",
          "text-3":       "#5C4F4A",
          border:         "#1C1210",
          "border-2":     "#251916",
          /* brand */
          accent:         "#7A0E22",
          "accent-hover": "#960F28",
          "accent-text":  "#F4A5B0",
          "accent-bright":"#C41E3A",
          orange:         "#F57C00",
          "orange-hover": "#E06500",
          "orange-text":  "#FFB74D",
          cream:          "#FFF7E6",
          /* status */
          green:          "#22C55E",
          "green-text":   "#86EFAC",
          red:            "#EF4444",
          "red-text":     "#FCA5A5",
          amber:          "#F59E0B",
          "amber-text":   "#FCD34D",
          violet:         "#8B5CF6",
          "violet-text":  "#C4B5FD",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 1px)",
        sm: "calc(var(--radius) - 2px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
