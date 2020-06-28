import fs from "fs";
import { resolve } from "path";
import { CreateTableInput } from "aws-sdk/clients/dynamodb";

interface Config {
  tables?: CreateTableInput[];
  basePort?: number;
}

const loadConfig = (configFile: string): Config =>
  fs.existsSync(configFile) ? require(configFile) : {}; // eslint-disable-line import/no-dynamic-require, global-require

const configFile = (configDir: string): string =>
  resolve(configDir, "jest-dynalite-config.js");

let config = loadConfig(configFile(process.cwd()));

export const setConfigDir = (configDir: string): void => {
  config = loadConfig(configFile(configDir));
};

export const getDynalitePort = (): number =>
  (config.basePort || 8000) +
  parseInt(process.env.JEST_WORKER_ID as string, 10);

export const getTables = (): CreateTableInput[] => config.tables || [];
