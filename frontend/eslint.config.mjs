import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    {
        files: ["**/*.ts", "**/*.tsx"],
    },
    {
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
        ],
    },
    {
        ignores: [
            "**/node_modules",
            "**/dist",
            "**/test-workspace",
            "**/coverage",
            "**/*.js",
            "**/*.mjs",
            "**/.next",
            "**/.storybook",
        ],
    },
    {
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            react,
            "react-hooks": reactHooks,
        },

        languageOptions: {
            globals: {
                browser: true,
                commonjs: true,
                es6: true,
                node: true,
                worker: true,
                jest: true,
                mocha: true
            },
            ecmaVersion: 9,
            sourceType: "module",
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],

            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/prefer-readonly": "error",
            "block-spacing": ["error", "always"],

            "brace-style": ["error", "1tbs", {
                allowSingleLine: true,
            }],

            "eol-last": ["error"],

            indent: ["error", 4, {
                SwitchCase: 1,
            }],

            "linebreak-style": ["error", "unix"],
            "no-console": ["warn"],

            "no-constant-condition": ["error", {
                checkLoops: false,
            }],

            "no-trailing-spaces": ["error"],
            "object-curly-spacing": ["error", "always"],
            "space-in-parens": ["error", "never"],
            "space-before-blocks": ["error", "always"],
            "keyword-spacing": ["error", { "before": true, "after": true }],
            quotes: ["error", "single"],
            semi: ["error", "always"],
        },
    }
);
