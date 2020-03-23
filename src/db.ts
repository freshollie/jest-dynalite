import AWS, { AWSError } from "aws-sdk";
import dynalite from "dynalite";
import { getTables, getDynalitePort } from "./config";

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

export const start = (): Promise<void> =>
  new Promise(resolve =>
    dynaliteInstance.listen(process.env.MOCK_DYNAMODB_PORT, resolve)
  );

export const stop = (): Promise<void> =>
  new Promise(resolve => dynaliteInstance.close(() => resolve()));

export const deleteTables = async (): Promise<void> => {
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
};

export const createTables = async (): Promise<void> => {
  const dynamoDB = dbClient();
  const tables = getTables();

  await Promise.all(tables.map(table => dynamoDB.createTable(table).promise()));
  await Promise.all(
    tables.map(table => waitForTable(dynamoDB, table.TableName))
  );
};
