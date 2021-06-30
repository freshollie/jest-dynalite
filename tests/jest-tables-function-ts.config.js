const { join } = require("path");
const base = require("../jest.base");

module.exports = {
  ...base,
  setupFiles: [join(__dirname, "setups/setupTablesFunctionTs.ts")],
  setupFilesAfterEnv: [join(__dirname, "setups/setupAdvancedEnv.ts")],
  displayName: {
    name: "tables-function-ts",
    color: "yellow",
  },
};
