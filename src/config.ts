import fs from "fs";
import { resolve } from "path";
import { Config, TableConfig } from "./types";
import { isFunction } from "./utils";

export const CONFIG_FILE_NAME = "jest-dynalite-config.js";
export const CONFIG_FILE_NAME_CJS = "jest-dynalite-config.cjs";
export const CONFIG_FILE_NAME_TS = "jest-dynalite-config.ts";

export class NotFoundError extends Error {
  constructor(dir: string) {
    super(
      `Could not find '${CONFIG_FILE_NAME}' or '${CONFIG_FILE_NAME_TS}' in dir ${dir}`
    );
  }
}

if (!process.env.JEST_DYNALITE_CONFIG_DIRECTORY) {
  process.env.JEST_DYNALITE_CONFIG_DIRECTORY = process.cwd();
}

const findConfigOrError = (
  directory: string
):
  | typeof CONFIG_FILE_NAME
  | typeof CONFIG_FILE_NAME_CJS
  | typeof CONFIG_FILE_NAME_TS => {
  const foundFile = (
    [CONFIG_FILE_NAME, CONFIG_FILE_NAME_CJS, CONFIG_FILE_NAME_TS] as const
  ).find((config) => {
    const file = resolve(directory, config);
    return fs.existsSync(file);
  });

  if (!foundFile) {
    throw new NotFoundError(resolve(directory));
  }

  return foundFile;
};

const readConfig = (): Config => {
  const configFile = findConfigOrError(
    process.env.JEST_DYNALITE_CONFIG_DIRECTORY!
  );
  const file = resolve(process.env.JEST_DYNALITE_CONFIG_DIRECTORY!, configFile);

  try {
    const importedConfig = require(file); // eslint-disable-line import/no-dynamic-require, global-require
    if ("default" in importedConfig) {
      return importedConfig.default;
    }
    return importedConfig;
  } catch (e) {
    throw new Error(
      `Something went wrong reading your ${configFile}: ${(e as Error).message}`
    );
  }
};

export const setConfigDir = (directory: string): void => {
  // Only allow this directory to be set if a config exists
  findConfigOrError(directory);
  process.env.JEST_DYNALITE_CONFIG_DIRECTORY = directory;
};

export const getDynalitePort = (): number => {
  const { basePort = 8000 } = readConfig();
  if (Number.isInteger(basePort) && basePort > 0 && basePort <= 65535) {
    return basePort + parseInt(process.env.JEST_WORKER_ID || "0", 10);
  }

  throw new TypeError(
    `Option "basePort" must be an number between 1 and 65535. Received "${basePort.toString()}"`
  );
};

// Cache the tables result from the config function, so that we
// are not calling it over and over
let tablesCache: TableConfig[] | undefined;

export const getTables = async (): Promise<TableConfig[]> => {
  if (tablesCache) {
    return tablesCache;
  }

  const tablesConfig = readConfig().tables;
  if (isFunction(tablesConfig)) {
    tablesCache = await tablesConfig();
  } else {
    tablesCache = tablesConfig ?? [];
  }

  if (!Array.isArray(tablesCache)) {
    throw new Error(
      "jest-dynalite requires that the tables configuration is an array"
    );
  }

  return tablesCache;
};
