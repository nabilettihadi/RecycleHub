/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#10B981',
        'secondary': '#059669',
        'accent': '#34D399',
      }
    },
  },
  plugins: [],
}
