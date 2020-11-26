const keystore = require("./keystore");

describe("keystore", () => {
  it("should allow items to be placed in the store", async () => {
    await Promise.all([
      keystore.putItem("1", { name: "value" }),
      keystore.putItem("2", { name: "another value" }),
    ]);

    expect(await keystore.getItem("1")).toEqual({ name: "value" });
    expect(await keystore.getItem("2")).toEqual({ name: "another value" });
  });

  it("should handle no value for key", async () => {
    expect(await keystore.getItem("a")).toBeUndefined();
  });

  it("should contain the existing key from example data", async () => {
    expect(await keystore.getItem("50")).toEqual({ name: "already exists" });
  });
});
