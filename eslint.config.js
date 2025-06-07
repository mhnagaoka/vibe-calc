import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, you can use strictTypeChecked for stricter rules:
      // ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules:
      // ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    ignores: ["vitest.config.ts", "vite.config.mjs"], // Ignore config files from type-aware linting
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      // Add the react-x and react-dom plugins
      "react-x": reactX,
      "react-dom": reactDom,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Enable React-specific recommended typescript rules
      ...reactX.configs["recommended-typescript"].rules,
      ...reactDom.configs.recommended.rules,
    },
  },
  // Separate config for config files that don't need type-aware linting
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["vitest.config.ts", "vite.config.mjs", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  }
);
