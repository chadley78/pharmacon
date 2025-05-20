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
        'xefag': {
          // Base product colors
          'sleep': {
            'base': '#8A0E4F',
            'tint': '#C71585',
          },
          'relax': {
            'base': '#FFD700',
            'tint': '#FFEEAA',
          },
          // CTA colors
          'cta': {
            'yellow': '#FFD700',
            'black': '#000000',
          },
          // Text colors
          'text': {
            'black': '#171717',
            'white': '#FFFFFF',
          }
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
export default config; 