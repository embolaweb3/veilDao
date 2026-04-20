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
        space:    "#040812",
        surface:  "#0a0f1e",
        "surface-2": "#0f1729",
        violet: {
          DEFAULT: "#7c3aed",
          light:   "#a78bfa",
          dim:     "#3b1f6e",
        },
        cyan: {
          DEFAULT: "#06b6d4",
          light:   "#67e8f9",
          dim:     "#0c4a6e",
        },
        emerald: {
          DEFAULT: "#10b981",
          light:   "#6ee7b7",
          dim:     "#064e3b",
        },
        rose: {
          DEFAULT: "#f43f5e",
          light:   "#fda4af",
          dim:     "#4c0519",
        },
        amber: {
          DEFAULT: "#f59e0b",
          dim:     "#451a03",
        },
      },
      backgroundImage: {
        "mesh-violet":
          "radial-gradient(ellipse 80% 80% at 20% 40%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 60%)",
        "mesh-dark":
          "radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, transparent 50%)",
      },
      animation: {
        "pulse-slow":    "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":         "float 6s ease-in-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
        "glow-pulse":    "glowPulse 3s ease-in-out infinite",
        "spin-slow":     "spin 8s linear infinite",
        "scramble-fade": "scrambleFade 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%":      { opacity: "1",   transform: "scale(1.05)" },
        },
        scrambleFade: {
          "0%":   { opacity: "0.5", letterSpacing: "0.5em" },
          "100%": { opacity: "1",   letterSpacing: "0.05em" },
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-violet": "0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)",
        "glow-cyan":   "0 0 30px rgba(6,182,212,0.4),  0 0 60px rgba(6,182,212,0.15)",
        "glow-emerald":"0 0 30px rgba(16,185,129,0.4), 0 0 60px rgba(16,185,129,0.15)",
        "glow-rose":   "0 0 30px rgba(244,63,94,0.4),  0 0 60px rgba(244,63,94,0.15)",
        "glass":       "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};

export default config;
