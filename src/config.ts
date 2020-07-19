import fs from "fs";
import { resolve } from "path";
import { CreateTableInput } from "aws-sdk/clients/dynamodb";

interface Config {
  tables: CreateTableInput[];
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

export const getTables = (): CreateTableInput[] => readConfig().tables ?? [];
