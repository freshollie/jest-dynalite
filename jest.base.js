module.exports = {
  rootDir: __dirname,
  coveragePathIgnorePatterns: ["/tests/", "/__testdir__/"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/**/*.js"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/src/"],
};
