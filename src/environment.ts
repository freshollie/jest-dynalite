// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from "jest-environment-node";
import type { Config } from "@jest/types";
import setup from "./setup";
import { start, stop } from "./db";
import { CONFIG_FILE_NAME, CONFIG_FILE_NAME_TS, NotFoundError } from "./config";

class DynaliteEnvironment extends NodeEnvironment {
  constructor(projectConfig: Config.ProjectConfig) {
    // The config directory is based on the root directory
    // of the project config

    const { rootDir } = projectConfig;
    const configDirectory =
      projectConfig.testEnvironmentOptions.jestDynaliteConfigDirectory;
    try {
      setup(typeof configDirectory === "string" ? configDirectory : rootDir);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new Error(`
jest-dynalite could not find "${CONFIG_FILE_NAME}" or "${CONFIG_FILE_NAME_TS}" in the ${
          typeof configDirectory === "string"
            ? `provided jestDynaliteConfigDirectory (${configDirectory})`
            : `jest <rootDir> (${rootDir})`
        }.

If you didn't intend to be using this directory for the config, please specify a custom
directory: https://github.com/freshollie/jest-dynalite/#advanced-setup

If you are not using the preset, you should apply 'import "jest-dynalite/withDb"'
to your "setupFilesAfterEnv".

For more information, please see https://github.com/freshollie/jest-dynalite/#breaking-changes.
      `);
      }
      throw e;
    }

    super(projectConfig);
  }

  public async setup(): Promise<void> {
    await super.setup();
    await start();
  }

  public async teardown(): Promise<void> {
    await stop();
    await super.teardown();
  }
}

export default DynaliteEnvironment;
module.exports = DynaliteEnvironment;
