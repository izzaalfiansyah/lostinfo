/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a855f7",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
