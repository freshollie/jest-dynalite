import NodeEnvironment from "jest-environment-node";
import { Config } from "@jest/types";
import setup from "./setup";
import { start, stop } from "./db";

export default class DynaliteEnvironment extends NodeEnvironment {
  constructor(projectConfig: Config.ProjectConfig) {
    // The config directory is based on the root directory
    // of the project config
    setup(projectConfig.rootDir);

    super(projectConfig);
  }

  public async setup(): Promise<void> {
    await super.setup();
    await start();
  }

  async teardown(): Promise<void> {
    await stop();
    await super.teardown();
  }
}
