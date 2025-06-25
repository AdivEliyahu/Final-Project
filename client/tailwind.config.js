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
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        rotateY: "rotateY 2s infinite alternate ease-in-out",
        fadeIn: "fadeIn 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
};
