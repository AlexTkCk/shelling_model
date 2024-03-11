/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      gridTemplateRows: {
        '50': 'repeat(50, minmax(0, 1fr))'
      },
      gridTemplateColumns: {
        '50': 'repeat(50, minmax(0, 1fr))'
      }
    },
  },
  plugins: [],
}

