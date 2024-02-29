/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
    fontFamily:{
      "logo": ['Logo'],
      "regular": ['MotserratRegular'],
      "medium": ['MotserratMedium'],
      "bold": ['MotserratBold'],
    }
  },
  plugins: [],
}

