/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: [
    './views/**/*.{hbs,handlebars,html}',
    './public/**/*.{js,css}',
    './src/**/*.{js,ts}',
    './src/**/*.css', // Add CSS files to content as well
  ],
  theme: {
    extend: {
      // Color palette - Supabase official design system
      colors: {
        // Primary brand colors - Purple from logo
        'primary-purple': '#9E28B5',  // Primary purple from logo
        'primary-purple-dark': '#7B1F91', // Darker purple
        'primary-purple-light': '#B44BC7', // Lighter purple
        'primary-purple-hover': '#8A23A0', // Purple hover state
        'primary-purple-variant': '#8E1FA6', // Alternative purple

        // Background colors
        'bg-primary': '#FFFFFF',      // Primary background (light)
        'bg-secondary': '#F9FAFB',    // Secondary background
        'bg-subtle': '#F3F4F6',       // Subtle background
        'bg-muted': '#E5E7EB',        // Muted background
        'bg-strong': '#D1D5DB',       // Strong background
        'bg-dark': '#111827',         // Dark background

        // Text colors
        'text-primary': '#111827',    // Primary text
        'text-secondary': '#4B5563',  // Secondary text
        'text-subtle': '#6B7280',     // Subtle text
        'text-inverse': '#FFFFFF',    // Inverse text
        'text-disabled': '#9CA3AF',   // Disabled text

        // Border colors
        'border-default': '#E5E7EB',  // Default border
        'border-strong': '#D1D5DB',   // Strong border
        'border-weak': '#F3F4F6',     // Weak border
        'border-dark': '#9CA3AF',     // Dark border

        // Status colors
        'success': '#10B981',         // Success status
        'warning': '#F59E0B',         // Warning status
        'error': '#EF4444',           // Error status
        'info': '#3B82F6',            // Info status

        // Gray scale
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',

        // Neutral colors
        'white': '#FFFFFF',
        'black': '#000000',

        // Interactive states
        'btn-primary-bg': '#9E28B5',
        'btn-primary-hover': '#8A23A0',
        'btn-secondary-bg': '#F3F4F6',
        'btn-secondary-hover': '#E5E7EB',
        'link-color': '#3B82F6',
        'link-hover': '#2563EB',
        
        // Additional colors for shadcn/ui based components
        'card': '#FFFFFF',
        'card-foreground': '#111827',
        'input': '#E5E7EB',
        'ring': '#9E28B5',
        'accent': '#F3F4F6',
        'accent-foreground': '#111827',
        'muted-foreground': '#6B7280',
        'ring-offset-background': '#FFFFFF',
        'text-card-foreground': '#111827',
      },
      // Ensure all utilities are generated
      backgroundColor: ({ theme }) => ({
        ...theme('colors'),
        'primary-purple': theme('colors.primary-purple'),
        'primary-purple-hover': theme('colors.primary-purple-hover'),
        'bg-primary': theme('colors.bg-primary'),
        'bg-secondary': theme('colors.bg-secondary'),
        'bg-subtle': theme('colors.bg-subtle'),
        'bg-muted': theme('colors.bg-muted'),
        'btn-primary-bg': theme('colors.btn-primary-bg'),
        'btn-secondary-bg': theme('colors.btn-secondary-bg'),
      }),
      textColor: ({ theme }) => ({
        ...theme('colors'),
        'primary-purple': theme('colors.primary-purple'),
        'text-primary': theme('colors.text-primary'),
        'text-secondary': theme('colors.text-secondary'),
        'text-subtle': theme('colors.text-subtle'),
        'text-inverse': theme('colors.text-inverse'),
      }),
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        'primary-purple': theme('colors.primary-purple'),
        'border-default': theme('colors.border-default'),
        'border-strong': theme('colors.border-strong'),
        'border-weak': theme('colors.border-weak'),
        'border-dark': theme('colors.border-dark'),
      }),
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
        DEFAULT: 'rgba(158,40,181,0.18)', // Focus ring using purple accent color
      },
      // Font family (Inter is a modern, readable font)
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  safelist: [
    // Primary purple brand colors
    { pattern: /^(bg|text|border|ring)-primary-purple$/ },
    { pattern: /^(bg|text|border|ring)-primary-purple-hover$/ },
    { pattern: /^(bg|text|border|ring)-primary-purple-light$/ },
    { pattern: /^(bg|text|border|ring)-primary-purple-dark$/ },
    
    // All color utility classes
    { pattern: /^(bg|text|border|ring)-(white|black|gray-(50|100|200|300|400|500|600|700|800|900))$/ },
    
    // Supabase specific colors
    { pattern: /^(bg|text|border|ring)-(success|warning|error|info)$/ },
    
    // Background utility classes
    { pattern: /^(bg)-(primary|secondary|subtle|muted|strong|dark|sidebar|sidebar-hover)$/ },
    
    // Text utility classes
    { pattern: /^(text)-(primary|secondary|subtle|inverse|disabled)$/ },
    
    // Border utility classes
    { pattern: /^(border)-(default|strong|weak|dark)$/ },
    
    // Button classes
    { pattern: /^(bg|text|border)-(btn-primary-bg|btn-primary-hover|btn-secondary-bg|btn-secondary-hover)$/ },
    
    // All common Tailwind utilities
    { pattern: /^(p|m|my|mx|mt|mb|ml|mr)-(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64)$/ },
    { pattern: /^(w|h)-(px|0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|auto|full|screen|11)$/ },
    { pattern: /^(rounded)-(none|sm|md|lg|xl)$/ },
    { pattern: /^(flex|grid|hidden|block|inline|items-center|justify-between|space-y-4|space-y-6|gap-4|gap-6)$/ },
    { pattern: /^(font)-(light|normal|medium|semibold|bold)$/ },
    { pattern: /^(shadow)-(sm|md|lg|xl)$/ },
    
    // Additional classes for the fixed portfolio design
    { pattern: /^(text)-(primary-purple|green-500|green-600|red-500|red-600)$/ },
    { pattern: /^(bg)-(card|input|background|purple-50|green-500\/10|green-500\/20|red-500\/10|red-500\/20)$/ },
    { pattern: /^(hover:bg)-(purple-50|green-500\/20|red-500\/20|accent)$/ },
    { pattern: /^(hover:text)-(primary-purple-hover|accent-foreground)$/ },
    { pattern: /^(text)-(accent-foreground|card-foreground|gray-400|gray-500|gray-600|white|gray-900)$/ },
    { pattern: /^(ring)-(offset-background|ring)$/ },
    { pattern: /^(border)-(input|t|default)$/ },
    { pattern: /^(size)-(4|6|8|10)$/ },
    { pattern: /^(h)-(10|12)$/ },
    { pattern: /^(max-w)-(6xl)$/ },
    { pattern: /^(px|py|pt|pb|pl|pr)-(0|1|2|3|4|6|8|9)$/ },
    { pattern: /^(w)-(full|10)$/ },
    { pattern: /^(m|my|mx|mt|mb|ml|mr)-(0|1|2|3|4|6|8|10|12|16|20|24)$/ },
    { pattern: /^(gap)-(1|2|3|4|6)$/ },
    { pattern: /^(top)-(1\/2)$/ },
    { pattern: /^(-translate-y)-(1\/2)$/ },
    { pattern: /^(left)-(3)$/ },
    { pattern: /^(right)-(2|3)$/ },
    { pattern: /^(z)-(10)$/ },
    { pattern: /^(items)-(center)$/ },
    { pattern: /^(justify)-(between|center)$/ },
    { pattern: /^(flex)-(1|col|row)$/ },
    { pattern: /^(whitespace)-(nowrap)$/ },
    { pattern: /^(font)-(medium|semibold|normal|light)$/ },
    { pattern: /^(rounded)-(md|lg)$/ },
    { pattern: /^(line-clamp)-(3)$/ },
    { pattern: /^(break)-(all)$/ },
    { pattern: /^(animate-in|fade-in)$/ },
  ],
  ],
  // Custom plugin to add semantic utilities and components
  plugins: [
    // Scrollbar plugin
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
        },
        '.scrollbar-thumb-gray-300': {
          'scrollbar-color': '#D1D5DB transparent',
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D1D5DB',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
        '.scrollbar-thumb-gray-700': {
          'scrollbar-color': '#374151 transparent',
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#374151',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
      });
    },
    // Custom plugin for semantic utilities and components
    function ({ addUtilities, addComponents, theme }) {
      // Add custom utilities
      addUtilities({
        '.bg-surface-1': {
          backgroundColor: theme('colors.bg-secondary'),
        },
        '.bg-surface-2': {
          backgroundColor: theme('colors.bg-muted'),
        },
        '.glass-overlay': {
          backgroundColor: theme('colors.white'),
        },
      });

      // Add custom components
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          border: `1px solid ${theme('colors.border-default')}`,
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.4'),
          boxShadow: theme('boxShadow.sm'),
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary-purple'),
          color: theme('colors.white'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: '600',
          padding: '0.5rem 1rem',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: theme('colors.primary-purple-hover'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.btn-secondary-bg'),
          color: theme('colors.text-primary'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: '600',
          padding: '0.5rem 1rem',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: theme('colors.btn-secondary-hover'),
          },
        },
        '.input-base': {
          backgroundColor: theme('colors.white'),
          border: `1px solid ${theme('colors.border-default')}`,
          borderRadius: theme('borderRadius.md'),
          color: theme('colors.text-primary'),
          padding: '0.5rem 0.75rem',
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 3px ${theme('colors.primary-purple-light')}`,
          },
        },
      });
    },
  ],
};