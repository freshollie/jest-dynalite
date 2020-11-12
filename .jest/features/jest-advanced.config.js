const base = require("../../jest.base.config");

module.exports = {
  ...base,
  setupFiles: ["<rootDir>/.jest/setupAdvanced.js"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupAdvancedEnv.js"],
  displayName: {
    name: "advanced-config",
    color: "green"
  }
};
