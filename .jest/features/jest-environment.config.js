const base = require("../../jest.base.config");

module.exports = {
  ...base,
  testEnvironment: "<rootDir>/dist/environment",
  setupFilesAfterEnv: ["<rootDir>/.jest/setupSimple.js"],
  displayName: {
    name: "simple-environment",
    color: "blue"
  }
};
