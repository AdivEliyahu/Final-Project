/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // important for React
  theme: {
    extend: {
      keyframes: {
        rotateY: {
          "0%": { transform: "rotateY(-15deg)" },
          "100%": { transform: "rotateY(15deg)" },
        },
      },
      animation: {
        rotateY: "rotateY 2s infinite alternate ease-in-out",
      },
    },
  },
  plugins: [],
};
