const { join } = require("path");
const base = require("../jest.base");

module.exports = {
  ...base,
  setupFiles: [join(__dirname, "setups/setupAdvanced.ts")],
  setupFilesAfterEnv: [join(__dirname, "setups/setupAdvancedEnv.ts")],
  displayName: {
    name: "advanced-config",
    color: "green",
  },
};
