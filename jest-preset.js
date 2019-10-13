const { resolve } = require("path");

module.exports = {
  setupFilesAfterEnv: [
    resolve(__dirname, "./dist/setupTables.js"),
    resolve(__dirname, "./dist/clearAfterEach.js")
  ],
  testEnvironment: resolve(__dirname, "./dist/environment.js")
};
