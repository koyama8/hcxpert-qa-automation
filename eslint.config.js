const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'cypress/evidencias/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'performance/lighthouse/**',
      'performance/results/**',
      'security/reports/**',
    ],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
      },
    },
  },
  {
    files: ['performance/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        __ENV: 'readonly',
      },
    },
  },
];
