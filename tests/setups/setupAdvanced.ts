import { join } from "path";
import { setup } from "../../src";

// Setup with the root config
setup(join(__dirname, "../"));

jest.resetModules();
jest.mock("aws-sdk", () => {
  throw new Error("should not import this");
});
