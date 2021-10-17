import { join } from "path";
import { Config } from "@jest/types";
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
      () =>
        new Environment({
          rootDir: "somebaddirectory",
          testEnvironmentOptions: {},
        } as Config.ProjectConfig)
    ).toThrowErrorMatchingSnapshot();
  });

  it("should throw a different error if a jestDynaliteConfigDirectory is passed to the test environment", () => {
    expect(
      () =>
        new Environment({
          testEnvironmentOptions: {
            jestDynaliteConfigDirectory: "somebaddirectory",
          } as Record<string, unknown>,
        } as Config.ProjectConfig)
    ).toThrowErrorMatchingSnapshot();
  });

  it("should not throw an error if a valid config directory is given", () => {
    expect(
      () =>
        new Environment({
          rootDir: join(__dirname, "__testdir__"),
          testEnvironmentOptions: {},
        } as Config.ProjectConfig)
    ).not.toThrowError();
  });

  it("should start the database when 'setup' is called and stop the db when 'teardown' is called", async () => {
    const environment = new Environment({
      rootDir: join(__dirname, "__testdir__"),
      testEnvironmentOptions: {},
    } as Config.ProjectConfig);
    await environment.setup();
    expect(dynaliteInstance.listening).toBeTruthy();
    await environment.teardown();
    expect(dynaliteInstance.listening).toBeFalsy();
  });

  it("should should work when config directory is specified", async () => {
    const environment = new Environment({
      testEnvironmentOptions: {
        jestDynaliteConfigDirectory: join(__dirname, "__testdir__"),
      } as Record<string, unknown>,
    } as Config.ProjectConfig);
    await environment.setup();
    expect(dynaliteInstance.listening).toBeTruthy();
    await environment.teardown();
    expect(dynaliteInstance.listening).toBeFalsy();
  });
});
