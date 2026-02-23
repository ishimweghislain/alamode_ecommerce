/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#064E3B",      // Dark Green
        secondary: "#047857",    // Emerald
        accent: "#10B981",       // Light Emerald
        gold: "#D4AF37",         // Luxury Gold
        soft: "#F5F5F4",         // Soft Gray
        darkbg: "#0F172A",       // Deep Background
      },
    },
  },
  plugins: [],
};