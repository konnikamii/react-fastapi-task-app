module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: [
      "./tsconfig.json",
      "./tsconfig.node.json",
      "./tsconfig.server.json",
    ],
    tsconfigRootDir: __dirname,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  ignorePatterns: [
    "dist",
    "dist-server",
    ".eslintrc.cjs",
    "tailwind.config.js",
    "postcss.config.js",
    "declarations.d.ts",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: { 
    // Disable prop-types rule since we are using TypeScript
    "react/prop-types": "off",
    // Additional rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the react version
    },
  },
};