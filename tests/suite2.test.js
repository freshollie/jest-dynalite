const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const ddb = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local",
});

it("should insert item into table", async () => {
  await ddb
    .put({ TableName: "files", Item: { id: "1", hello: "world" } })
    .promise();

  const { Item } = await ddb
    .get({ TableName: "files", Key: { id: "1" } })
    .promise();

  expect(Item).toEqual({
    id: "1",
    hello: "world",
  });
});

it("clears tables between tests", async () => {
  const { Item } = await ddb
    .get({ TableName: "files", Key: { id: "1" } })
    .promise();

  expect(Item).not.toEqual({
    id: "1",
    hello: "world",
  });
});
