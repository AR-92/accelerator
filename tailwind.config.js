/** @type {import('tailwindcss').Config} */
export default {
  content: ["./lib/**/*.{js,hbs}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsl(290 64% 95%)",
          100: "hsl(290 64% 90%)",
          200: "hsl(290 64% 80%)",
          300: "hsl(290 64% 70%)",
          400: "hsl(290 64% 60%)",
          500: "hsl(290 64% 43%)",
          600: "hsl(290 64% 35%)",
          700: "hsl(290 64% 28%)",
          800: "hsl(290 64% 20%)",
          900: "hsl(290 64% 10%)",
        },
        secondary: "hsl(260 64% 43%)",
        accent: "hsl(110 64% 43%)",
        neutral: "hsl(290 10% 50%)",
        base: {
          100: "hsl(0 0% 100%)",
          200: "hsl(290 10% 95%)",
          300: "hsl(290 10% 90%)",
        },
        info: "hsl(217 91% 60%)",
        success: "hsl(142 76% 36%)",
        warning: "hsl(38 92% 50%)",
        error: "hsl(0 84% 60%)",
      },
    },
  },
  plugins: [],
};
