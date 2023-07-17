/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4784f5",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
