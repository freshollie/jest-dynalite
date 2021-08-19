import base from "./jest.base";

export default {
  ...base,
  testPathIgnorePatterns: ["/node_modules/", "/tests/", "/e2e/"],
  displayName: {
    name: "unit",
    color: "white",
  },
};
