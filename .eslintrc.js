module.exports = {
  parser: "babel-eslint",
  extends: ["eslint:recommended", "prettier", "plugin:react/recommended"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "16.4.0"
    }
  },
  env: { node: true, es6: true },
  rules: { "react/prop-types": 0 },
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true
      }
    }
  ]
};
