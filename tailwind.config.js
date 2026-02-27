/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#4F46E5',
          cyan: '#06B6D4',
          emerald: '#10B981',
        }
      }
    },
  },
  plugins: [],
}
