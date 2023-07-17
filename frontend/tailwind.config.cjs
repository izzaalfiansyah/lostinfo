/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9333ea",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
