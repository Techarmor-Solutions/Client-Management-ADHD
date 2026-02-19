/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F6F3',
        surface: '#FFFFFF',
        'text-primary': '#1C1B18',
        'text-secondary': '#6B6860',
        brand: '#4F7BF7',
        overdue: {
          bg: '#FEF2F2',
          text: '#DC2626',
        },
      },
    },
  },
  plugins: [],
}
