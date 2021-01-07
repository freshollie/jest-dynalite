jest.resetModules();
jest.mock("../../src/utils", () => ({
  ...(jest.requireActual("../../src/utils") as any),
  hasV3: () => false,
}));

jest.mock("@aws-sdk/client-dynamodb", () => {
  throw new Error("should not import this");
});
