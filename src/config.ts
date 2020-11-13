import fs from "fs";
import { resolve } from "path";
import { CreateTableInput } from "aws-sdk/clients/dynamodb";
import { isFunction } from "./utils";

type TableConfig = CreateTableInput & { data?: unknown[] };

type Config = {
  tables?: TableConfig[] | (() => TableConfig[] | Promise<TableConfig[]>);
  basePort?: number;
};

const CONFIG_FILE_NAME = "jest-dynalite-config.js";

let configDir: string =
  process.env.JEST_DYNALITE_CONFIG_DIRECTORY || process.cwd();

const readConfig = (): Config => {
  const configFile = resolve(configDir, CONFIG_FILE_NAME);
  if (fs.existsSync(configFile)) {
    return require(configFile); // eslint-disable-line import/no-dynamic-require, global-require
  }

  throw new Error(
    `Could not find '${CONFIG_FILE_NAME}' in ${resolve(configDir)}`
  );
};

export const setConfigDir = (directory: string): void => {
  const configFile = resolve(directory, CONFIG_FILE_NAME);
  if (!fs.existsSync(configFile)) {
    throw new Error(
      `Could not find '${CONFIG_FILE_NAME}' in ${resolve(configDir)}`
    );
  }

  process.env.JEST_DYNALITE_CONFIG_DIRECTORY = directory;
  configDir = directory;
};

export const getDynalitePort = (): number => {
  const config = readConfig();
  return (
    (config.basePort ?? 8000) +
    parseInt(process.env.JEST_WORKER_ID as string, 10)
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
