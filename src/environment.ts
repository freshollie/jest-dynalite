import NodeEnvironment from "jest-environment-node";
import { Config } from "@jest/types";
import setup from "./setup";
import { start, stop } from "./db";

export default class DynaliteEnvironment extends NodeEnvironment {
  constructor(projectConfig: Config.ProjectConfig) {
    // The config directory is based on the root directory
    // of the project config

    const { rootDir } = projectConfig;
    try {
      setup(projectConfig.rootDir);
    } catch (e) {
      // eslint-disable-next-line no-console
      throw new Error(`
jest-dynalite could not find a config file in the jest <rootDir> (${rootDir}).

If you didn't intend to be using this directory for the config, please specify a custom
directory: https://github.com/freshollie/jest-dynalite/#monorepoadvanced-setup

If you are already using a custom config directory, you should apply 'import "jest-dynalite/withDb"'
to your "setupFilesAfterEnv" instead of using the jest-dynalite preset or environment.

Please see https://github.com/freshollie/jest-dynalite/issues/6#issuecomment-654167172 for
more info.
      `);
    }

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
