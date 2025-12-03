// tailwind.config.js (minimal for a .handlebars project on Tailwind v4)
export default {
  content: [
    './views/**/*.handlebars',
    './src/**/*.{html,handlebars}',
    './public/**/*.html',
  ],
  safelist: ['animate-rainbow-shadow', 'hover:animate-rainbow-shadow'],
  // keep theme minimal — colors & other tokens live in CSS @theme
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        card: '32px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
