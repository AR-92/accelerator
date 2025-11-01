module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['public/js/htmx.min.js'],
  overrides: [
    {
      files: ['public/js/**/*.js'],
      env: {
        browser: true,
      },
      rules: {
        'no-console': 'off',
        'no-unused-vars': 'warn',
      },
    },
    {
      files: ['src/utils/**/*.js'],
      env: {
        browser: true,
      },
      rules: {
        'no-console': 'off',
        'no-unused-vars': 'warn',
      },
    },

    {
      files: ['src/**/*.js'],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-unsupported-features/node-builtins': 'off',
      },
    },
  ],
  rules: {
    'node/no-unpublished-require': 'off',
    'node/no-missing-require': 'off',
    'node/no-process-exit': 'off',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
  },
};
