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
        saffron: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        tricolor: {
          orange: "#FF671F",
          white: "#FFFFFF",
          green: "#046A38",
            navy: "#06038D",
        },
          yojana: {
            navy: '#0B3B7A',
            navyDark: '#062840',
            light: '#EEF8FF',
            accent: '#0B7CBE',
            success: '#16A34A',
            warn: '#F59E0B',
            danger: '#DC2626',
          }
      },
    },
  },
  plugins: [],
};
export default config;
