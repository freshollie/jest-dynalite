import AWS from "aws-sdk";
import dynalite from "dynalite";
import { getTables } from "./config";

const dynaliteInstance = dynalite({
  createTableMs: 0,
  deleteTableMs: 0,
  updateTableMs: 0
});

const dbClient = (): AWS.DynamoDB =>
  new AWS.DynamoDB({
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local"
  });

export const start = (): Promise<void> =>
  new Promise(resolve =>
    dynaliteInstance.listen(process.env.MOCK_DYNAMODB_PORT, resolve)
  );

export const stop = (): Promise<void> =>
  new Promise(resolve => dynaliteInstance.close(resolve));

export const deleteTables = async (): Promise<void> => {
  const dynamoDB = dbClient();
  const tables = getTables();
  await Promise.all(
    tables.map(table =>
      dynamoDB.deleteTable({ TableName: table.TableName }).promise()
    )
  );
  await Promise.all(
    tables.map(table =>
      dynamoDB.waitFor("tableNotExists", { TableName: table.TableName })
    )
  );
};

export const createTables = async (): Promise<void> => {
  const dynamoDB = dbClient();
  const tables = getTables();

  await Promise.all(tables.map(table => dynamoDB.createTable(table).promise()));
  await Promise.all(
    tables.map(table =>
      dynamoDB.waitFor("tableExists", { TableName: table.TableName })
    )
  );
};
