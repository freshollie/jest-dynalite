const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const ddb = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local",
});

it("should contain table data provided in config", async () => {
  {
    const { Item } = await ddb
      .get({
        TableName: "images",
        Key: { url: "https://something.com/something/image.jpg" },
      })
      .promise();

    expect(Item).toEqual({
      url: "https://something.com/something/image.jpg",

      width: 100,
      height: 200,
    });
  }
  {
    const { Item } = await ddb
      .get({
        TableName: "images",
        Key: { url: "https://something.com/something/image2.jpg" },
      })
      .promise();

    expect(Item).toEqual({
      url: "https://something.com/something/image2.jpg",
      width: 150,
      height: 250,
    });
  }
});

it("should ensure that data is recreated after each test", async () => {
  await ddb
    .delete({
      TableName: "images",
      Key: { url: "https://something.com/something/image2.jpg" },
    })
    .promise();
});

// This test must follow the previous
it("post should ensure that data is recreated after each test", async () => {
  const { Item } = await ddb
    .get({
      TableName: "images",
      Key: { url: "https://something.com/something/image2.jpg" },
    })
    .promise();

  expect(Item).toEqual({
    url: "https://something.com/something/image2.jpg",
    width: 150,
    height: 250,
  });
});
