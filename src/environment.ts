// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from "jest-environment-node";
import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from "@jest/environment";
import setup from "./setup";
import { start, stop } from "./db";
import { CONFIG_FILE_NAME, CONFIG_FILE_NAME_TS, NotFoundError } from "./config";

class DynaliteEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    // The config directory is based on the root directory
    // of the project config

    const compatConfig =
      "projectConfig" in config
        ? config
        : // For jest <= 27 the config was the project config
          // so use that
          ({ projectConfig: config } as unknown as JestEnvironmentConfig);

    const { rootDir } = compatConfig.projectConfig;

    try {
      setup(rootDir);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new Error(`
jest-dynalite could not find "${CONFIG_FILE_NAME}" or "${CONFIG_FILE_NAME_TS}" in the jest <rootDir> (${rootDir}).

If you didn't intend to be using this directory for the config, please specify a custom
directory: https://github.com/freshollie/jest-dynalite/#advanced-setup

If you are already using a custom config directory, you should apply 'import "jest-dynalite/withDb"'
to your "setupFilesAfterEnv" instead of using the preset.

For more information, please see https://github.com/freshollie/jest-dynalite/#breaking-changes.
      `);
      }
      throw e;
    }

    super(compatConfig, _context);
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
