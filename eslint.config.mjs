import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import prettierConfig from 'eslint-config-prettier';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
    // ── TypeScript files ──
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: [resolve(__dirname, 'tsconfig.app.json'), resolve(__dirname, 'tsconfig.spec.json')],
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            '@angular-eslint': angular,
        },
        rules: {
            // No console.log
            'no-console': 'error',

            // No `any`
            '@typescript-eslint/no-explicit-any': 'error',

            // No non-null assertions (!)
            '@typescript-eslint/no-non-null-assertion': 'error',

            // Max function length: 35 lines
            'max-lines-per-function': ['error', { max: 35, skipBlankLines: true, skipComments: true }],

            // Max file length: 400 lines
            'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],

            // Max params: 5
            'max-params': ['error', 5],

            // Cyclomatic complexity: 7
            complexity: ['error', 7],
        },
    },

    // ── Override for main.ts — allow console.error ──
    {
        files: ['src/main.ts'],
        rules: {
            'no-console': ['error', { allow: ['error'] }],
        },
    },

    // ── Override for spec files — relax function length ──
    {
        files: ['**/*.spec.ts'],
        rules: {
            'max-lines-per-function': 'off',
        },
    },

    // ── Angular HTML templates ──
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            '@angular-eslint/template': angularTemplate,
        },
        rules: {},
    },

    // ── Prettier compat (disables conflicting rules) ──
    prettierConfig,
];
