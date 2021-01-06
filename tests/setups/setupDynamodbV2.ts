jest.resetModules();
jest.mock("../../src/utils", () => ({
  ...(jest.requireActual("../../src/utils") as any),
  hasV3: () => false,
}));
