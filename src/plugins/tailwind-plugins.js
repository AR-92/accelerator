const plugin = require('tailwindcss/plugin');

// Custom plugin for accessibility utilities
const accessibilityPlugin = plugin(function({ addUtilities, theme }) {
  const newUtilities = {
    '.sr-only-focusable': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
      '&:focus': {
        position: 'static',
        width: 'auto',
        height: 'auto',
        padding: '0.5rem',
        margin: '0',
        overflow: 'visible',
        clip: 'auto',
        whiteSpace: 'normal',
      }
    },
    '.skip-link': {
      position: 'absolute',
      top: '-1000px',
      left: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      zIndex: '9999',
      backgroundColor: theme('colors.primary.DEFAULT'),
      color: theme('colors.primary.foreground'),
      padding: theme('padding.2'),
      textDecoration: 'none',
      '&:focus': {
        position: 'fixed',
        top: '10px',
        left: '10px',
        width: 'auto',
        height: 'auto',
        overflow: 'visible',
        clip: 'auto',
      }
    }
  };

  addUtilities(newUtilities, {
    variants: ['responsive', 'focus'],
  });
});

// Custom plugin for advanced typography
const typographyPlugin = plugin(function({ addComponents, theme }) {
  addComponents({
    '.prose-unstyled': {
      'h1, h2, h3, h4, h5, h6': {
        margin: 0,
        padding: 0,
        fontWeight: theme('fontWeight.semibold'),
      },
      p: {
        margin: `${theme('margin.4')} 0`,
        lineHeight: theme('lineHeight.relaxed'),
      },
      'ul, ol': {
        margin: `${theme('margin.4')} 0`,
        paddingLeft: theme('padding.8'),
      },
      li: {
        margin: `${theme('margin.2')} 0`,
        lineHeight: theme('lineHeight.normal'),
      },
      a: {
        color: theme('colors.primary.DEFAULT'),
        textDecoration: 'underline',
        textDecorationColor: theme('colors.primary.DEFAULT'),
        textUnderlineOffset: '2px',
        transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
        '&:hover': {
          color: theme('colors.primary.foreground'),
          textDecorationColor: theme('colors.primary.foreground'),
        },
        '&:focus': {
          outline: `2px solid ${theme('colors.ring')}`,
          outlineOffset: '2px',
        }
      },
      blockquote: {
        borderLeft: `4px solid ${theme('colors.border')}`,
        paddingLeft: theme('padding.4'),
        fontStyle: 'italic',
        color: theme('colors.muted.foreground'),
        margin: `${theme('margin.6')} 0`,
      },
    }
  });
});

// Custom plugin for animation utilities
const animationPlugin = plugin(function({ addUtilities, matchUtilities, theme }) {
  addUtilities({
    '.animate-in': {
      animationName: 'fadeIn',
      animationDuration: theme('animation.DEFAULT'),
      '--tw-enter-opacity': '0',
      '--tw-enter-scale': '1',
      '--tw-enter-rotate': '0',
      '--tw-enter-translate-x': '0',
      '--tw-enter-translate-y': '0',
    },
    '.animate-out': {
      animationName: 'fadeOut',
      animationDuration: theme('animation.DEFAULT'),
      '--tw-exit-opacity': '1',
      '--tw-exit-scale': '1',
      '--tw-exit-rotate': '0',
      '--tw-exit-translate-x': '0',
      '--tw-exit-translate-y': '0',
    },
  });
  
  matchUtilities({
    'duration': (value) => ({
      'animationDuration': value,
    }),
    'animate': (value) => ({
      'animationName': value,
    }),
  }, { 
    values: theme('animation'),
  });
});

// Custom plugin for responsive design utilities
const responsivePlugin = plugin(function({ addUtilities, theme }) {
  const viewports = theme('screens', {});
  const responsiveUtilities = {};
  
  for (const [name, size] of Object.entries(viewports)) {
    responsiveUtilities[`.breakpoint-${name}`] = {
      '@media (min-width: ' + size + ')': {
        '--breakpoint': name
      }
    };
  }
  
  addUtilities(responsiveUtilities, {
    variants: ['responsive'],
  });
});

// Custom plugin for grid layout utilities
const gridPlugin = plugin(function({ addUtilities, theme }) {
  const gridUtilities = {
    '.grid-cols-auto-fit': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
    },
    '.grid-cols-auto-fill': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(0, 1fr))',
    },
    '.grid-flow-dense': {
      gridAutoFlow: 'dense',
    },
    '.grid-span-full': {
      gridColumn: '1 / -1',
    },
    '.grid-row-span-full': {
      gridRow: '1 / -1',
    },
  };
  
  addUtilities(gridUtilities, {
    variants: ['responsive'],
  });
});

module.exports = {
  accessibilityPlugin,
  typographyPlugin,
  animationPlugin,
  responsivePlugin,
  gridPlugin,
};