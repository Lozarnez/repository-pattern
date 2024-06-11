import globals from 'globals';
import pluginJs from '@eslint/js';
import json from 'eslint-plugin-json';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import requireSort from 'eslint-plugin-sort-requires';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { files: ['**/*.json'], ...json.configs['recommended'] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: { prettier, 'sort-requires': requireSort },
    rules: {
      'no-console': 'error',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-else-return': 'warn',
      'no-throw-literal': 'error',
      'no-multi-spaces': 'error',
      'no-param-reassign': 'warn',
      'no-undef': 'error',
      'prettier/prettier': 'error',
      'sort-requires/sort-requires': 2,
    },
  },
  pluginJs.configs.recommended,
  configPrettier,
];
