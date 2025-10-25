/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: [
    './views/**/*.{hbs,handlebars,html}',
    './public/**/*.{js,css}',
    './src/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      // Color palette - dark, minimal, Supabase-like design
      colors: {
        'bg-primary': '#343541',      // Primary background
        'bg-secondary': '#443544',   // Secondary background 
        'bg-sidebar': '#202123',     // Sidebar background
        'bg-sidebar-hover': '#2A2B32', // Hover state for sidebar items
        'surface-1': '#2B2B32',      // Primary surface
        'surface-2': '#393941',      // Secondary surface
        'text-primary': '#ECECF1',   // Primary text
        'text-secondary': '#9A9B9F', // Secondary text
        'muted': '#7C7D82',          // Muted text
        'border': '#565869',         // Border color
        'accent-default': '#10A37F', // Default accent color
        'accent-600': '#14B587',     // Lighter accent
        'accent-700': '#19C37D',     // Darker accent
        'focus-ring': 'rgba(16,163,127,0.18)', // Focus ring color
        'glass-overlay': 'rgba(255,255,255,0.03)', // Glass effect overlay
        'danger': '#FF6B6B',         // Error/danger color
        'success': '#2ECC71',        // Success color
      },
      // Border radius values
      borderRadius: {
        'xl': '12px',
        'lg': '10px', 
        'sm': '8px',
      },
      // Spacing values (semantic)
      spacing: {
        '2.5': '10px',  // 2.5 spacing unit
        '3.5': '14px',  // 3.5 spacing unit
        '4.5': '18px',  // 4.5 spacing unit
        'base': '16px', // Base spacing unit
      },
      // Shadow effects
      boxShadow: {
        'soft-dark': '0 6px 18px rgba(8,10,16,0.45)',  // Subtle dark shadow
        'soft-elev': '0 10px 30px rgba(8,10,16,0.55)', // Elevation shadow
      },
      // Ring color for focus states
      ringColor: {
        DEFAULT: 'rgba(16,163,127,0.18)', // Focus ring using accent color
      },
      // Font family (Inter is a modern, readable font)
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  // Custom plugin to add semantic utilities and components
  plugins: [
    // Custom plugin for semantic utilities and components
    function ({ addUtilities, addComponents, theme }) {
      // Add custom utilities
      addUtilities({
        '.bg-surface-1': {
          backgroundColor: theme('colors.surface-1'),
        },
        '.bg-surface-2': {
          backgroundColor: theme('colors.surface-2'),
        },
        '.glass-overlay': {
          backgroundColor: theme('colors.glass-overlay'),
        },
      });

      // Add custom components
      addComponents({
        '.card': {
          background: `linear-gradient(180deg, ${theme('colors.surface-1')} 0%, ${theme('colors.surface-2')} 100%)`,
          border: `1px solid ${theme('colors.border')}`,
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.base'),
          boxShadow: theme('boxShadow.soft-dark'),
        },
        '.btn-primary': {
          backgroundColor: theme('colors.accent-default'),
          color: theme('colors.text-primary'),
          borderRadius: theme('borderRadius.xl'),
          fontWeight: '500',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: theme('colors.accent-600'),
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          border: `1px solid ${theme('colors.border')}`,
          borderRadius: theme('borderRadius.lg'),
        },
        '.input-base': {
          backgroundColor: 'transparent',
          border: `1px solid ${theme('colors.border')}`,
          borderRadius: theme('borderRadius.lg'),
          color: theme('colors.text-primary'),
          padding: '0.625rem 0.75rem', // ~10px 12px
          '&:focus': {
            boxShadow: `0 0 0 3px ${theme('colors.focus-ring')}`,
          },
        },
      });
    },
  ],
};