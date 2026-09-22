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
        background: "#08070d",
        surface: "#110e1c",
        "surface-card": "#171326",
        "surface-hover": "#221c38",
        border: "#282142",
        primary: {
          DEFAULT: "#a855f7",
          hover: "#9333ea",
          muted: "rgba(168, 85, 247, 0.15)",
        },
      },
      backgroundImage: {
        "radial-purple": "radial-gradient(circle at 50% 60%, rgba(139, 92, 246, 0.16) 0%, rgba(15, 12, 28, 0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
