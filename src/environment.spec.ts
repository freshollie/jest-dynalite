import { join } from "path";
import Environment from "./environment";
import { dynaliteInstance } from "./db";

jest.mock("dynalite", () => () => {
  let listening = false;
  return {
    get listening() {
      return listening;
    },
    listen: (_: void, resolve: () => void) => {
      listening = true;
      resolve();
    },
    close: (resolve: () => void) => {
      listening = false;
      resolve();
    },
  };
});

describe("Environment", () => {
  it("should throw an error if config file could not be located", () => {
    expect(
      () => new Environment({ rootDir: "somebaddirectory" } as any)
    ).toThrowErrorMatchingSnapshot();
  });

  it("should not throw an error if a valid config directory is given", () => {
    expect(
      () => new Environment({ rootDir: join(__dirname, "__testdir__") } as any)
    ).not.toThrowError();
  });

  it("should start the database when 'setup' is called and stop the db when 'teardown' is called", async () => {
    const environment = new Environment({
      rootDir: join(__dirname, "__testdir__"),
    } as any);
    await environment.setup();
    expect(dynaliteInstance.listening).toBeTruthy();
    await environment.teardown();
    expect(dynaliteInstance.listening).toBeFalsy();
  });
});
