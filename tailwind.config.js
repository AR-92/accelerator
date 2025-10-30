/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/views/**/*.{hbs,handlebars,html}',
    './src/components/**/*.{hbs,handlebars,html,js,ts,jsx,tsx}',
    './src/pages/**/*.{hbs,handlebars,html,js,ts,jsx,tsx}',
    './src/app/**/*.{hbs,handlebars,html,js,ts,jsx,tsx}',
    './public/**/*.js',
    './src/**/*.{js,ts,jsx,tsx}',
    '!./src/**/*.test.{js,ts,jsx,tsx}',
    '!./src/tests/**/*',
    '!./coverage/**/*',
    '!./dist/**/*',
    '!./build/**/*',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          primaryForeground: "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          accentForeground: "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  safelist: [
    // Safelist for dynamic classes that might not be detected by content scanning
    // Keep only essential classes that are applied dynamically via JavaScript or templating
    {
      pattern: /^(bg|text|border|ring)-(primary|secondary|accent|destructive|muted|card|popover|foreground|background)$/,
      variants: ['hover', 'focus', 'active', 'dark']
    },
    // Individual classes that might be applied dynamically
    "bg-sidebar",
    "text-sidebar-foreground",
    "bg-sidebar-primary",
    "text-sidebar-primary-foreground",
    "bg-sidebar-accent",
    "text-sidebar-accent-foreground",
    "border-sidebar-border",
    "ring-sidebar-ring",
  ],
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};