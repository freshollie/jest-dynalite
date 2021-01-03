const { join } = require("path");
const base = require("../jest.base");

module.exports = {
  ...base,
  setupFiles: [join(__dirname, "setups/setupAdvanced.ts")],
  setupFilesAfterEnv: [
    join(__dirname, "setups/setupDynamodbV2.ts"),
    join(__dirname, "setups/setupSimple.ts"),
  ],
  displayName: {
    name: "sdk-v2",
    color: "red",
  },
};
