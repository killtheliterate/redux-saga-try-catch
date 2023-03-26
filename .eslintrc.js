module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'prettier'],

  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: './',
  },

  rules: {
    // eslint
    'comma-dangle': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // typescript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },

  overrides: [
    {
      files: ['*.js', '*.mjs'],

      parserOptions: {
        project: null,
      },
    },
  ],
}
