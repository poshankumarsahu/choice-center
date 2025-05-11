module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    commonjs: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "commonjs",
  },
  globals: {
    require: "readonly",
    module: "readonly",
    exports: "readonly",
  },
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    quotes: ["error", "double"],
  },
};
