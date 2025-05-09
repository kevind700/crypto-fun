// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      'no-unused-vars': 'warn',
      'no-unused-expressions': 'warn',
      'no-unused-labels': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        vars: 'all', 
        args: 'after-used', 
        ignoreRestSiblings: false 
      }]
    }
  },
]);
