const { default: Environment } = require("../dist/environment");

describe("environment", () => {
  it("should throw an error if config file could not be located", () => {
    expect(
      () => new Environment({ rootDir: "somebaddirectory" })
    ).toThrowErrorMatchingSnapshot();
  });
});
