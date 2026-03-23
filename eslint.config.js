const js = require('@eslint/js')

module.exports = [
  js.configs.recommended,
  {
    ignores: ['public/**', 'eslint.config.js', 'eslint.config.mjs'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^(req|res|next)$' }],
    },
  },
]
