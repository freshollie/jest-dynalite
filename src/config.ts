import fs from "fs";
import { resolve } from "path";
import { CreateTableInput } from "aws-sdk/clients/dynamodb";
import { isFunction } from "./utils";

interface Config {
  tables?:
    | CreateTableInput[]
    | (() => CreateTableInput[] | Promise<CreateTableInput[]>);
  basePort?: number;
}

let configDir: string =
  process.env.JEST_DYNALITE_CONFIG_DIRECTORY || process.cwd();

const readConfig = (): Config => {
  const configFile = resolve(configDir, "jest-dynalite-config.js");
  if (fs.existsSync(configFile)) {
    return require(configFile); // eslint-disable-line import/no-dynamic-require, global-require
  }

  throw new Error(
    `Could not find 'jest-dynalite-config.js' in ${resolve(configDir)}`
  );
};

export const setConfigDir = (directory: string): void => {
  const configFile = resolve(directory, "jest-dynalite-config.js");
  if (!fs.existsSync(configFile)) {
    throw new Error(
      `Could not find 'jest-dynalite-config.js' in ${resolve(configDir)}`
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
let tablesCache: CreateTableInput[] | undefined;

export const getTables = async (): Promise<CreateTableInput[]> => {
  if (tablesCache) {
    return tablesCache;
  }

  const tablesConfig = readConfig().tables;
  if (isFunction(tablesConfig)) {
    tablesCache = await tablesConfig();
  } else {
    tablesCache = tablesConfig ?? [];
  }

  return tablesCache;
};
