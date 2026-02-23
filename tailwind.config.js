/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#064E3B",      // Dark Green
          emerald: "#047857",   // Emerald
          accent: "#10B981",    // Accent
          gold: "#D4AF37",      // Gold
          gray: "#F5F5F4",      // Soft gray
        },
        background: {
          dark: "#0F172A",      // Dark background
        }
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        outfit: ['var(--font-outfit)'],
      },
      borderRadius: {
        'luxury': '0.75rem',
      }
    },
  },
  plugins: [],
};