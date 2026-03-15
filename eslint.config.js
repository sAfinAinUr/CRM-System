import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { EndOfLineState } from 'typescript';

const paddingAroundTypeAlias = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: {
      missingBefore: 'Expected blank line before type declaration.',
      missingAfter: 'Expected blank line after type declaration.',
    },
  },
  create(context) {
    const src = context.sourceCode;

    return {
      TSTypeAliasDeclaration(node) {
        const stmt = node.parent?.type === 'ExportNamedDeclaration' ? node.parent : node;

        const tokenBefore = src.getTokenBefore(stmt, { includeComments: true });

        if (tokenBefore && stmt.loc.start.line - tokenBefore.loc.end.line < 2) {
          context.report({ node, messageId: 'missingBefore' });
        }

        const tokenAfter = src.getTokenAfter(stmt, { includeComments: true });

        if (tokenAfter && tokenAfter.loc.start.line - stmt.loc.end.line < 2) {
          context.report({ node, messageId: 'missingAfter' });
        }
      },
    };
  },
};

export default [
  { ignores: ['eslint.config.js'] },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs.flat['recommended-latest'],
  prettierRecommended,
  { settings: { react: { version: 'detect' } } },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      'local-rules': { rules: { 'padding-around-type-alias': paddingAroundTypeAlias } },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2,
          semi: true,
          trailingComma: 'none',
          endOfLine: 'lf',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^react-dom'],
            ['^@?\\w'],
            ['^(src|components|pages|store|types|api|helpers|providers)(/.*|$)'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': ['error'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'class' },
        { blankLine: 'always', prev: 'class', next: '*' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-const' },
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-expression' },
      ],
      'local-rules/padding-around-type-alias': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          filter: { regex: 'Props$', match: true },
          format: null,
          custom: { regex: '^Props$', match: true },
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
];

