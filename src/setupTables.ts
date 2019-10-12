import AWS from "aws-sdk";
import { CreateTableInput, DeleteTableInput } from "aws-sdk/clients/dynamodb";
import config from "./config";

const deleteTables = async (
  dynamoDB: AWS.DynamoDB,
  tables: DeleteTableInput[]
): Promise<void> => {
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

const createTables = async (
  dynamoDB: AWS.DynamoDB,
  tables: CreateTableInput[]
): Promise<void> => {
  await Promise.all(tables.map(table => dynamoDB.createTable(table).promise()));
  await Promise.all(
    tables.map(table =>
      dynamoDB.waitFor("tableExists", { TableName: table.TableName })
    )
  );
};

beforeEach(async () => {
  const dynamoDB = new AWS.DynamoDB({
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local"
  });

  if (config.tables) {
    await createTables(dynamoDB, config.tables);
  }
});

afterEach(async () => {
  const dynamoDB = new AWS.DynamoDB({
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local"
  });

  if (config.tables) {
    await deleteTables(dynamoDB, config.tables);
  }
});
