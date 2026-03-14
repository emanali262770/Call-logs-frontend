/** @type {import('tailwindcss').Config} */

import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8",
        primaryDark: "#1e40af",
        accent: "#e94560",
        newPrimary: "#605BFF",
        secondary: "#58C5A0",
        Green: "#2B9943",
      },
      screens: {
        '900': '900px',
      },
    },
  },
  plugins: [scrollbarHide],
};