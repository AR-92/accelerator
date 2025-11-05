// PostCSS Configuration with Performance Optimizations
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Additional performance optimizations
    '@fullhuman/postcss-purgecss': {
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
      defaultExtractor: (content) => {
        // Use a more efficient extractor
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        const innerMatches =
          content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || [];
        return broadMatches.concat(innerMatches);
      },
      safelist: [
        // Safelist for dynamic classes that might not be detected by content scanning
        {
          pattern:
            /^(bg|text|border|ring)-(primary|secondary|accent|destructive|muted|card|popover|foreground|background|sidebar)/,
          variants: [
            'hover',
            'focus',
            'active',
            'dark',
            'group-hover',
            'group-focus',
          ],
        },
        // Individual classes that might be applied dynamically
        'bg-sidebar',
        'text-sidebar-foreground',
        'bg-sidebar-primary',
        'text-sidebar-primary-foreground',
        'bg-sidebar-accent',
        'text-sidebar-accent-foreground',
        'border-sidebar-border',
        'ring-sidebar-ring',
      ],
    },
    // Additional optimization plugins
    cssnano: {
      preset: 'default',
    },
  },
};
