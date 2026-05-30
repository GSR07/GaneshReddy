/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#0ea5e9',
        'accent-2': '#6366f1',
        'accent-3': '#94a3b8',
        surface: 'rgba(255,255,255,0.055)',
      },
      fontFamily: {
        main: ['Outfit', 'sans-serif'],
        head: ['Syne', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
