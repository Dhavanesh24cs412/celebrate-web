/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'celebrate-navy': '#0A2947',
        'celebrate-cream': '#F3E4C9',
        'celebrate-sage': '#D3D4C0',
        'celebrate-terracotta': '#8B5E3C',
        background: '#F3E4C9',
        foreground: '#0A2947',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
