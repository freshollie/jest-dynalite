import AWS, { AWSError } from "aws-sdk";
import dynalite from "dynalite";
import { getTables, getDynalitePort } from "./config";
import { isPromise, omit } from "./utils";

type Connection = {
  dynamoDB: AWS.DynamoDB;
  documentClient: AWS.DynamoDB.DocumentClient;
};

const globalObj = (typeof window === "undefined" ? global : window) as {
  setTimeout: {
    _isMockFunction?: boolean;
    clock?: boolean;
  };
};

const detectTimers = (): { legacy: boolean; modern: boolean } => {
  const usingJestAndTimers =
    typeof jest !== "undefined" && typeof globalObj.setTimeout !== "undefined";
  const usingLegacyJestFakeTimers =
    usingJestAndTimers &&
    // eslint-disable-next-line no-underscore-dangle
    typeof globalObj.setTimeout._isMockFunction !== "undefined" &&
    // eslint-disable-next-line no-underscore-dangle
    globalObj.setTimeout._isMockFunction;

  let usingModernJestFakeTimers = false;
  if (
    usingJestAndTimers &&
    typeof globalObj.setTimeout.clock !== "undefined" &&
    typeof jest.getRealSystemTime !== "undefined"
  ) {
    try {
      // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
      jest.getRealSystemTime();
      usingModernJestFakeTimers = true;
    } catch {
      // not using Jest's modern fake timers
    }
  }

  return {
    legacy: usingLegacyJestFakeTimers,
    modern: usingModernJestFakeTimers,
  };
};

// stolen from https://github.com/testing-library/dom-testing-library/blob/master/src/helpers.js
const runWithRealTimers = <T, R>(
  callback: () => T | Promise<R>
): T | Promise<R> => {
  const { modern, legacy } = detectTimers();

  const usingJestFakeTimers = modern || legacy;

  if (usingJestFakeTimers) {
    jest.useRealTimers();
  }

  const callbackReturnValue = callback();

  if (isPromise(callbackReturnValue)) {
    return callbackReturnValue.then((value) => {
      if (usingJestFakeTimers) {
        jest.useFakeTimers(modern ? "modern" : "legacy");
      }

      return value;
    });
  }

  if (usingJestFakeTimers) {
    jest.useFakeTimers(modern ? "modern" : "legacy");
  }

  return callbackReturnValue;
};

const dynaliteInstance = dynalite({
  createTableMs: 0,
  deleteTableMs: 0,
  updateTableMs: 0,
});

let connection: Connection | undefined;

const dbConnection = (): Connection => {
  if (connection) {
    return connection;
  }
  const options = {
    endpoint: `localhost:${getDynalitePort()}`,
    sslEnabled: false,
    region: "local",
  };

  connection = {
    dynamoDB: new AWS.DynamoDB(options),
    documentClient: new AWS.DynamoDB.DocumentClient(options),
  };

  return connection;
};

const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

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
    await new Promise<void>((resolve) =>
      dynaliteInstance.listen(process.env.MOCK_DYNAMODB_PORT, resolve)
    );
  }
};

export const stop = async (): Promise<void> => {
  if (dynaliteInstance.listening) {
    await new Promise<void>((resolve) =>
      dynaliteInstance.close(() => resolve())
    );
  }
};

export const deleteTables = (): Promise<void> =>
  runWithRealTimers(async () => {
    const { dynamoDB } = dbConnection();
    const tables = await getTables();
    await Promise.all(
      tables.map((table) =>
        dynamoDB
          .deleteTable({ TableName: table.TableName })
          .promise()
          .catch(() => {})
      )
    );
    await Promise.all(
      tables.map((table) => waitForDeleted(dynamoDB, table.TableName))
    );
  });

export const createTables = (): Promise<void> =>
  runWithRealTimers(async () => {
    const { dynamoDB, documentClient } = dbConnection();
    const tables = await getTables();

    await Promise.all(
      tables.map((table) => dynamoDB.createTable(omit(table, "data")).promise())
    );
    await Promise.all(
      tables.map((table) => waitForTable(dynamoDB, table.TableName))
    );
    await Promise.all(
      tables.map(
        (table) =>
          table.data &&
          Promise.all(
            table.data.map((row) => {
              return documentClient
                .put({ TableName: table.TableName, Item: row as any })
                .promise()
                .catch((e) => {
                  throw new Error(
                    `Could not add ${JSON.stringify(row)} to "${
                      table.TableName
                    }": ${e.message}`
                  );
                });
            })
          )
      )
    );
  });
