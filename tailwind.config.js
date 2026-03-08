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
      },
      keyframes: {
        'progress-loading': {
          '0%': { width: '0%', left: '0%' },
          '50%': { width: '70%', left: '0%' },
          '100%': { width: '100%', left: '0%' }
        }
      },
      animation: {
        'progress-loading': 'progress-loading 1.2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};