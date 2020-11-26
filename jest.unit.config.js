const base = require("./jest.base");

module.exports = {
  ...base,
  testPathIgnorePatterns: ["/node_modules/", "/tests/", "/e2e/"],
  displayName: {
    name: "unit",
    color: "white",
  },
};
