const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const ddb = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local"
});

module.exports = {
  getItem: async byId => {
    const { Item } = await ddb
      .get({ TableName: "keys", Key: { id: byId } })
      .promise();

    return Item && Item.value;
  },
  putItem: (id, value) =>
    ddb.put({ TableName: "keys", Item: { id, value } }).promise()
};
