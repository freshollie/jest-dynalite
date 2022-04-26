import { join } from "path";
import { getDynalitePort, setConfigDir } from "./config";
import { BASE_PORT } from "./__testdir__/defined-basePort/jest-dynalite-config";

const DEFAULT_BASE_PORT = 8000;

describe("Config", () => {
  const configDirectory = join(__dirname, "__testdir__", "defined-basePort");

  beforeAll(() => {
    setConfigDir(configDirectory);
  });

  it("a different port is returned for each worker", () => {
    const expectedPort =
      BASE_PORT + parseInt(process.env.JEST_WORKER_ID as string, 10);

    expect(getDynalitePort()).toBe(expectedPort);
  });

  it("should return dynalite port even there is no JEST_WORKER_ID", () => {
    const workerId = process.env.JEST_WORKER_ID;
    delete process.env.JEST_WORKER_ID;

    const port = getDynalitePort();

    expect(port).not.toBeNaN();
    expect(getDynalitePort()).toBe(BASE_PORT);

    process.env.JEST_WORKER_ID = workerId;
  });

  it("if basePort is not defined then port 8000 will be used as a default", () => {
    setConfigDir(join(__dirname, "__testdir__"));
    const expectedPort =
      DEFAULT_BASE_PORT + parseInt(process.env.JEST_WORKER_ID as string, 10);

    expect(getDynalitePort()).toBe(expectedPort);
  });
});
