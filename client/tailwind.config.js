/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#32B2DF",
          200: "#026CA1",
          300: "#205295",
          400: "#144272",
          450: "#013047",
          500: "#002E57",
          550: "#002C42",
          600: "#0A2647",
          700: "#0A2342",
        },
        cyan: {
          100: "#00FFFC",
        },
        green: {
          100: "#1ED760",
        },
        background: {
          default: "#00141e",
          footer: "#000000",
        },
      },
      screens: {
        sm: '640px', // mobile
        md: '768px', // tablet
        lg: '1024px', // desktop
        xl: '1280px', // large desktop
      },
      fontFamily: {
        heading: ['Lexend', ...defaultTheme.fontFamily.sans],
        body: ['Lexend', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}