import fs from "fs";
import { Config } from "./types";
import { getDynalitePort, setConfigDir } from "./config";

const BASE_PORT = 8443;
const DEFAULT_BASE_PORT = 8000;

const mockedConfig = jest.fn((): Config => ({ basePort: BASE_PORT }));
const configPath = "/fakepath/jest-dynalite-config.js";

jest.mock("fs");
(fs.existsSync as jest.Mock).mockReturnValue(true);

jest.mock("path", () => {
  const original = jest.requireActual("path");
  return {
    ...original,
    resolve: jest.fn(() => configPath),
  };
});

jest.mock(configPath, () => mockedConfig(), { virtual: true });

describe("Config", () => {
  beforeAll(() => {
    setConfigDir("/whatever");
  });

  test("a different port is returned for each worker", () => {
    const expectedPort =
      BASE_PORT + parseInt(process.env.JEST_WORKER_ID as string, 10);

    expect(getDynalitePort()).toBe(expectedPort);
  });

  test("should return dynalite port even there is no JEST_WORKER_ID", () => {
    const workerId = process.env.JEST_WORKER_ID;
    delete process.env.JEST_WORKER_ID;

    const port = getDynalitePort();

    expect(port).not.toBeNaN();
    expect(port).toBe(BASE_PORT);

    process.env.JEST_WORKER_ID = workerId;
  });

  test("if basePort is not defined then port 8000 will be used as a default", () => {
    jest.resetModules();
    mockedConfig.mockReturnValue({});
    const expectedPort =
      DEFAULT_BASE_PORT + parseInt(process.env.JEST_WORKER_ID || "0", 10);

    expect(getDynalitePort()).toBe(expectedPort);
  });

  test("should throw an error if basePort in config file is invalid", () => {
    jest.resetModules();
    // @ts-ignore
    mockedConfig.mockReturnValue({ basePort: "this is not a number" });

    expect(getDynalitePort).toThrowError(TypeError);
  });
});
