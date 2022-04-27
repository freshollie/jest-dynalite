module.exports = {
  tables: [
    {
      TableName: "keys",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      data: [
        {
          id: "50",
          value: { name: "already exists" },
        },
      ],
    },
  ],
  basePort: 8001,
};
