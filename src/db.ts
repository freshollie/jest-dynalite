import dynalite from "dynalite";
import { getTables, getDynalitePort } from "./config";
import { hasV3 } from "./utils";
import { dynamodbv2, dynamodbv3 } from "./dynamodb";

export const dynaliteInstance = dynalite({
  createTableMs: 0,
  deleteTableMs: 0,
  updateTableMs: 0,
});

export const start = async (): Promise<void> => {
  if (!dynaliteInstance.listening) {
    await new Promise<void>((resolve) =>
      dynaliteInstance.listen(process.env.MOCK_DYNAMODB_PORT, resolve)
    );
  }
};

export const stop = async (): Promise<void> => {
  if (hasV3()) {
    dynamodbv3.killConnection();
  }
  if (dynaliteInstance.listening) {
    await new Promise<void>((resolve) =>
      dynaliteInstance.close(() => resolve())
    );
  }
};

export const deleteTables = async (): Promise<void> => {
  const tablesNames = (await getTables()).map((table) => table.TableName);
  if (hasV3()) {
    await dynamodbv3.deleteTables(tablesNames, getDynalitePort());
  } else {
    await dynamodbv2.deleteTables(tablesNames, getDynalitePort());
  }
};

export const createTables = async (): Promise<void> => {
  const tables = await getTables();
  if (hasV3()) {
    await dynamodbv3.createTables(tables, getDynalitePort());
  } else {
    await dynamodbv2.createTables(tables, getDynalitePort());
  }
};
