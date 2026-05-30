/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'petrol-blue': '#005f73',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Add the cursive font here
        cursive: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
}