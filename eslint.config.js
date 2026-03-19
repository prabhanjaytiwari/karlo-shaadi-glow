import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Supabase & error handlers commonly use `any` — disable for now
      "@typescript-eslint/no-explicit-any": "off",
      // UI component interfaces that extend others legitimately have no extra members
      "@typescript-eslint/no-empty-object-type": "off",
      // Allow require() in config files
      "@typescript-eslint/no-require-imports": "off",
      // Exhaustive deps are warnings only — stale closures caught at runtime via QA
      "react-hooks/exhaustive-deps": "warn",
    },
  },
);
