
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1', // Indigo 500
          light: '#818CF8',   // Indigo 400
          dark: '#4F46E5',    // Indigo 600
        },
        secondary: {
          DEFAULT: '#EC4899', // Pink 500
          light: '#F472B6',   // Pink 400
          dark: '#DB2777',    // Pink 600
        },
        background: '#111827', // Gray 900
        surface: '#1F2937',    // Gray 800
        textPrimary: '#F3F4F6', // Gray 100
        textSecondary: '#9CA3AF', // Gray 400
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
