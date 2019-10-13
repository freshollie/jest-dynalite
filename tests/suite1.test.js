const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const ddb = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local"
});

it("should not share data between test suites", async () => {
  const { Item } = await ddb
    .get({ TableName: "files", Key: { id: "1" } })
    .promise();

  expect(Item).not.toBeDefined();
});
