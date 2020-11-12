const realTimeout = setTimeout;
const sleep = time => new Promise(resolve => realTimeout(resolve, time));

module.exports = {
  tables: async () => {
    await sleep(300);
    return [
      {
        TableName: "files",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      }
    ];
  },
  basePort: 8000
};
