module.exports = [
  {
    TableName: "files",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
  {
    TableName: "images",
    KeySchema: [{ AttributeName: "url", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "url", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    data: [
      {
        url: "https://something.com/something/image.jpg",
        width: 100,
        height: 200,
      },
      {
        url: "https://something.com/something/image2.jpg",
        width: 150,
        height: 250,
      },
    ],
  },
];
