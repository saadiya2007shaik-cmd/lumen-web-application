/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nude: {
          50:  '#faf7f2',
          100: '#f7f3ee',
          200: '#ece4da',
          300: '#e0d4c4',
          400: '#c9b8a2',
          500: '#a89078',
          600: '#8b6f5c',
          700: '#6b5344',
          800: '#4a3a2e',
          900: '#3d342c',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}