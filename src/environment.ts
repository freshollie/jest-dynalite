// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from "jest-environment-node";
import type { Config } from "@jest/types";
import setup from "./setup";
import { start, stop } from "./db";

class DynaliteEnvironment extends NodeEnvironment {
  constructor(projectConfig: Config.ProjectConfig) {
    // The config directory is based on the root directory
    // of the project config

    const { rootDir } = projectConfig;
    try {
      setup(rootDir);
    } catch (e) {
      throw new Error(`
jest-dynalite could not find "jest-dynalite-config.js" in the jest <rootDir> (${rootDir}).

If you didn't intend to be using this directory for the config, please specify a custom
directory: https://github.com/freshollie/jest-dynalite/#advanced-setup

If you are already using a custom config directory, you should apply 'import "jest-dynalite/withDb"'
to your "setupFilesAfterEnv" instead of using the preset.

For more information, please see https://github.com/freshollie/jest-dynalite/#breaking-changes.
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

export = DynaliteEnvironment;
