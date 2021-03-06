import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TableConfig } from "../types";
import { omit, runWithRealTimers, sleep } from "../utils";

type Connection = {
  dynamoDB: DynamoDB;
  documentDB: DocumentClient;
};

let connection: Connection | undefined;

const dbConnection = (port: number): Connection => {
  if (connection) {
    return connection;
  }
  const options = {
    endpoint: `localhost:${port}`,
    sslEnabled: false,
    region: "local",
  };

  connection = {
    dynamoDB: new DynamoDB(options),
    documentDB: new DocumentClient(options),
  };

  return connection;
};

const waitForTable = async (
  client: DynamoDB,
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
  client: DynamoDB,
  tableName: string
): Promise<void> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const details = await client
      .describeTable({ TableName: tableName })
      .promise()
      .catch((e) => e.name === "ResourceInUseException");

    // eslint-disable-next-line no-await-in-loop
    await sleep(100);

    if (!details) {
      break;
    }
  }
};

export const deleteTables = (
  tableNames: string[],
  port: number
): Promise<void> =>
  runWithRealTimers(async () => {
    const { dynamoDB } = dbConnection(port);
    await Promise.all(
      tableNames.map((table) =>
        dynamoDB
          .deleteTable({ TableName: table })
          .promise()
          .catch(() => {})
      )
    );
    await Promise.all(
      tableNames.map((table) => waitForDeleted(dynamoDB, table))
    );
  });

export const createTables = (
  tables: TableConfig[],
  port: number
): Promise<void> =>
  runWithRealTimers(async () => {
    const { dynamoDB, documentDB } = dbConnection(port);

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
            table.data.map((row) =>
              documentDB
                .put({ TableName: table.TableName, Item: row as any })
                .promise()
                .catch((e) => {
                  throw new Error(
                    `Could not add ${JSON.stringify(row)} to "${
                      table.TableName
                    }": ${e.message}`
                  );
                })
            )
          )
      )
    );
  });
