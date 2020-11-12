const base = require("../../jest.base.config");

module.exports = {
  ...base,
  preset: "./jest-preset.js",
  displayName: {
    name: "preset",
    color: "magenta"
  }
};
