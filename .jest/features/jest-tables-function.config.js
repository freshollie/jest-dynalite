const base = require("../../jest.base.config");

module.exports = {
  ...base,
  setupFiles: ["<rootDir>/.jest/setupTablesFunction.js"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupAdvancedEnv.js"],
  displayName: {
    name: "tables-function",
    color: "yellow"
  }
};
