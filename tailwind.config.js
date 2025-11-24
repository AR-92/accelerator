// tailwind.config.js (minimal for a .hbs project on Tailwind v4)
export default {
  content: ['./views/**/*.hbs', './src/**/*.{html,hbs}', './public/**/*.html'],
  // keep theme minimal — colors & other tokens live in CSS @theme
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
