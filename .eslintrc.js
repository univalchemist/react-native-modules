module.exports = {
  extends: ["@ftdr/eslint-config/ts-react"],
  parserOptions: {
    requireConfigFile: false,
  },
  settings: {
    "import/ignore": ["react-native"],
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
