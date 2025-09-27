import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

import { defineConfig } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, prettier, import: importPlugin },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'arrow-body-style': ['error', 'as-needed'],
      'no-console': 'warn',
      'prettier/prettier': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unamedComponents: 'function-expression',
        },
      ],
      'react/react-in-jsx-scope': 'off',
    },
    ignores: ['**/*.{js,mjs,cjs}'],
  },
])
