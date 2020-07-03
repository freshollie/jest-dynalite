import AWS, { AWSError } from "aws-sdk";
import dynalite from "dynalite";
import { getTables, getDynalitePort } from "./config";

const globalObj = typeof window === "undefined" ? global : window;

const isPromise = <R>(p: unknown | Promise<R>): p is Promise<R> =>
  p && Object.prototype.toString.call(p) === "[object Promise]";

// stolen from https://github.com/testing-library/dom-testing-library/blob/master/src/helpers.js
const runWithRealTimers = <T, R>(
  callback: () => T | Promise<R>
): T | Promise<R> => {
  const usingJestFakeTimers =
    globalObj.setTimeout &&
    // eslint-disable-next-line no-underscore-dangle
    ((globalObj.setTimeout as unknown) as any)._isMockFunction &&
    typeof jest !== "undefined";

  if (usingJestFakeTimers) {
    jest.useRealTimers();
  }

  const callbackReturnValue = callback();

  if (isPromise(callbackReturnValue)) {
    return callbackReturnValue.then(value => {
      if (usingJestFakeTimers) {
        jest.useFakeTimers();
      }

      return value;
    });
  }

  if (usingJestFakeTimers) {
    jest.useFakeTimers();
  }

  return callbackReturnValue;
};

const dynaliteInstance = dynalite({
  createTableMs: 0,
  deleteTableMs: 0,
  updateTableMs: 0
});

const dbClient = (): AWS.DynamoDB =>
  new AWS.DynamoDB({
    endpoint: `localhost:${getDynalitePort()}`,
    sslEnabled: false,
    region: "local"
  });

const sleep = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, time));

const waitForTable = async (
  client: AWS.DynamoDB,
  tableName: string
): Promise<void> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const details = await client
      .describeTable({ TableName: tableName })
      .promise()
      .catch(() => undefined);

    if (details?.Table?.TableStatus === "ACTIVE") {
      // eslint-disable-next-line no-await-in-loop
      await sleep(10);
      break;
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(10);
  }
};

/**
 * Poll the tables list to ensure that the given list of tables exists
 */
const waitForDeleted = async (
  client: AWS.DynamoDB,
  tableName: string
): Promise<void> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const details = await client
      .describeTable({ TableName: tableName })
      .promise()
      .catch((e: AWSError) => e.name === "ResourceInUseException");

    // eslint-disable-next-line no-await-in-loop
    await sleep(100);

    if (!details) {
      break;
    }
  }
};

export const start = async (): Promise<void> => {
  if (!dynaliteInstance.listening) {
    await new Promise(resolve =>
      dynaliteInstance.listen(process.env.MOCK_DYNAMODB_PORT, resolve)
    );
  }
};

export const stop = async (): Promise<void> => {
  if (dynaliteInstance.listening) {
    await new Promise(resolve => dynaliteInstance.close(() => resolve()));
  }
};

export const deleteTables = async (): Promise<void> =>
  runWithRealTimers(async () => {
    const dynamoDB = dbClient();
    const tables = getTables();
    await Promise.all(
      tables.map(table =>
        dynamoDB
          .deleteTable({ TableName: table.TableName })
          .promise()
          .catch(() => {})
      )
    );
    await Promise.all(
      tables.map(table => waitForDeleted(dynamoDB, table.TableName))
    );
  });

export const createTables = async (): Promise<void> =>
  runWithRealTimers(async () => {
    const dynamoDB = dbClient();
    const tables = getTables();

    await Promise.all(
      tables.map(table => dynamoDB.createTable(table).promise())
    );
    await Promise.all(
      tables.map(table => waitForTable(dynamoDB, table.TableName))
    );
  });
