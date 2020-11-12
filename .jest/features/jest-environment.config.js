module.exports = {
  rootDir: "../../",
  testEnvironment: "<rootDir>/dist/environment",
  setupFilesAfterEnv: ["<rootDir>/.jest/setupSimple.js"],
  displayName: {
    name: "simple-environment",
    color: "blue"
  }
};
