/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ff87",
        accent: "#ff6b35",
        dark: "#0a0a0f",
        card: "#13131a",
        border: "#1e1e2e",
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}