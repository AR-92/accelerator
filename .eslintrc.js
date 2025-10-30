module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'node/no-unpublished-require': 'off',
    'node/no-missing-require': 'off',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error'
  }
};