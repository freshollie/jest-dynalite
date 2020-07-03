module.exports = {
  testEnvironment: "<rootDir>/dist/environment",
  setupFiles: ["<rootDir>/setupTests/setupAdvanced.js"],
  setupFilesAfterEnv: ["<rootDir>/setupTests/setupSimple.js"]
};
