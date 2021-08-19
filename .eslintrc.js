module.exports = {
  plugins: ["@typescript-eslint", "prettier", "import", "jest"],
  extends: [
    "airbnb-typescript/base",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    project: "tsconfig.eslint.json",
  },
  env: {
    jest: true,
    browser: true,
  },
  rules: {
    "jest/expect-expect": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
  },

  overrides: [
    {
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
