// setimmediate polyfill must be imported first as `dynalite` depends on it
import "setimmediate";
import dynalite from "dynalite";
import { getTables, getDynalitePort } from "./config";
import { hasV3 } from "./utils";

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
    // v3 does something to prevent dynalite
    // from shutting down until we have
    // killed the dynamodb connection
    (await import("./dynamodb/v3")).killConnection();
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
    await (
      await import("./dynamodb/v3")
    ).deleteTables(tablesNames, getDynalitePort());
  } else {
    await (
      await import("./dynamodb/v2")
    ).deleteTables(tablesNames, getDynalitePort());
  }
};

export const createTables = async (): Promise<void> => {
  const tables = await getTables();
  if (hasV3()) {
    await (
      await import("./dynamodb/v3")
    ).createTables(tables, getDynalitePort());
  } else {
    await (
      await import("./dynamodb/v2")
    ).createTables(tables, getDynalitePort());
  }
};
