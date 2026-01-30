/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        simpsons: {
          yellow: "#FFD90F",
          "yellow-dark": "#E6C30E",
          "yellow-text": "#B8860B", // Darker yellow for text (3:1 contrast on white)
          sky: "#70D1F4",
          "sky-dark": "#5BBAD8",
          pink: "#F7A6C1",
          "pink-dark": "#E591AC",
          orange: "#FF9F00",
          brown: "#8B5A2B",
        },
      },
      fontFamily: {
        heading: ["Comic Sans MS", "cursive", "sans-serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
