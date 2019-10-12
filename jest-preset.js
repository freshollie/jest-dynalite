const { resolve } = require("path");

module.exports = {
  setupFilesAfterEnv: [resolve(__dirname, "./dist/setupTables.js")],
  testEnvironment: resolve(__dirname, "./dist/environment.js")
};
