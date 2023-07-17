/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#795b91",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
