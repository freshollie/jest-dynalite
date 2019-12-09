# jest-dynalite

[![Pipeline status](https://github.com/freshollie/jest-dynalite/workflows/Pipeline/badge.svg)](https://github.com/freshollie/jest-dynalite/actions)
[![Npm version](https://img.shields.io/npm/v/jest-dynalite)](https://www.npmjs.com/package/jest-dynalite)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Enchaned unit testing, with a mock DynamoDB instance

`jest-dynalite` is a fork of `@shelf/jest-dynamodb`, and allows unit tests to execute real
queries against a local DynamoDB instance.

## Behaviour

`jest-dynalite` runs a [dynalite](https://github.com/mhart/dynalite) instance per test runner, which means
test runners do not interfere.

`jest-dynalite` clears tables between tests by default.

## Installation

```
yarn add jest-dynalite -D
```

## Config

In your package root, create a `jest-dynalite-config.json` with the tables schemas,
and an optional `basePort` to run dynalite on:

```json
{
  "tables": [
    {
      "TableName": "table",
      "KeySchema": [{ "AttributeName": "id", "KeyType": "HASH" }],
      "AttributeDefinitions": [{ "AttributeName": "id", "AttributeType": "S" }],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    }
  ],
  "basePort": 8000
}
```

## Update your sourcecode

```javascript
const client = new DocumentClient({
  ...yourConfig,
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local"
  })
});
```

`process.env.MOCK_DYNAMODB_ENDPOINT` is unqiue to each test runner.

## Jest config

### Simple usage (preset)

jest.config.js

```javascript
module.exports = {
  ...
  preset: "jest-dynalite"
}
```

The simple preset config will use the config and clear tables
between tests by default.

This the recommended usage, unless you have custom `setupFilesAfterEnv` or `testEnvironment` set.

### More advanced

setup.js

```javascript
import "jest-dynalite/setupTables";

// Optional (but recommended)
import "jest-dynalite/clearAfterEach";
```

jest.config.js

```javascript
module.exports = {
  ...
  testEnvironment: "jest-dynalite/environment",
  setupFilesAfterEnv: ["./setup.js"]
}
```

This setup should be used if you want to override the default config of `clearAfterEach`.

### Most advanced

Specify the config dir

setupBeforeEnv.js

```javascript
import { setup } from "jest-dynalite";

// You must give it a config directory
setup(__dirname);
```

setupAfterEnv.js

```javascript
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";

beforeAll(startDb);

// Create tables but don't delete them after tests
beforeAll(createTables);

// or
beforeEach(createTables);
afterEach(deleteTables);

afterAll(stopDb);
```

jest.config.js

```javascript
module.exports = {
  ...
  setupFiles: ["./setupBeforeEnv.js"],
  setupFilesAfterEnv: ["./setupAfterEnv.js"]
}
```

This is by far the most complicated setup, but provides the ability to specifiy
an environment other than `jest-dynalite`, and also allows you to specify a config directory.

## License

`MIT`
