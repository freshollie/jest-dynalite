const base = require("../../jest.base.config");

module.exports = {
  ...base,
  setupFiles: ["<rootDir>/.jest/setupTablesFunctionAsync.js"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupAdvancedEnv.js"],
  displayName: {
    name: "tables-function-async",
    color: "cyan",
  },
};
