const base = require("../../jest.base.config");

module.exports = {
  ...base,
  testEnvironment: "<rootDir>/environment",
  setupFilesAfterEnv: ["<rootDir>/.jest/setupSimple.js"],
  displayName: {
    name: "simple-environment",
    color: "blue",
  },
};
