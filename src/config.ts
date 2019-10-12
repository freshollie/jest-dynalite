import fs from "fs";
import { resolve } from "path";
import cwd from "cwd";
import { CreateTableInput } from "aws-sdk/clients/dynamodb";

interface Config {
  tables?: CreateTableInput[];
  basePort?: number;
}

const CONFIG_FILE = resolve(cwd(), "jest-dynalite-config.json");
const configExists = (): boolean => fs.existsSync(CONFIG_FILE);

export default (configExists()
  ? JSON.parse(fs.readFileSync(CONFIG_FILE).toString())
  : {}) as Config;
