# jest-dynalite

[![Pipeline status](https://github.com/freshollie/jest-dynalite/workflows/Pipeline/badge.svg)](https://github.com/freshollie/jest-dynalite/actions)
[![Npm version](https://img.shields.io/npm/v/jest-dynalite)](https://www.npmjs.com/package/jest-dynalite)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Enchaned unit testing, with a mock DynamoDB instance

`jest-dynalite` is a fork of [@shelf/jest-dynamodb](https://github.com/shelfio/jest-dynamodb), and allows unit tests to execute real
queries against a local DynamoDB instance. it was created in an attempt to address some of the most important missing
features of `@shelf/jest-dynamodb`

## Why should I use this?

Using this `jest-dynalite` makes writing quiries with dynamodb very easy, your tests can really
check if your data is manipulated in the way you expect it to be. This means that queries and mutations
can be developed without ever having to deploy or run your application, and significantly speeds up
writing code which interacts with dynamodb.

This in turn makes your tests much more robust, because a change to a data structure or
db query in your application will be reflected by failing tests, instead of using mocks to check
if calls were made correctly.

This library could almost be seen as an integration test, but the lines are very blurred these days and
I'd definitely place this within the unit testing boundary because it can easily integrate with unit tests.

## Features

- Optionally clear tables between tests
- Isolated tables between test runners
- Ability to specify config directory
- No requirement for `java`

## Gotchas

When `jest-dynalite` fails, it's not entirely obvious what's going on. Here are some things which cause problems.

### Fake timers

- Ensure `jest.useFakeTimers` is only called for the tests where it needs to be used, not for the whole file. If you use fake timers,
  ensure that `jest.useRealTimers` is called after every test (`afterEach`). If this doesn't happen, jest-dynalite will timeout trying to
  teardown tables.

## Installation

```
yarn add jest-dynalite -D
```

## Timeouts

Because jest has a default timeout of 5000ms per test, `jest-dynalite` can sometimes cause failures due to the timeout
being exceeded. This can happen when there are many tests or lots of tables to create between tests.
If this happens, try increasing your test timeouts `jest.setTimeout(10000)`. Another option is to selectively
run the database only for suites which use it. Please see [advanced config](###Monorepo/Advanced-setup)

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

### Monorepo/Advanced setup

When you use `jest-dynalite` in a monorepo, you must tell it where
the config directory is, as it's not possible to detect.

setupBeforeEnv.js

```javascript
import { setup } from "jest-dynalite";

// You must give it a config directory
setup(__dirname);
```

In every test suite you are using `dynamodb` apply `import "jest-dynalite/withDb"` to the top of
the test suites to run the db for your that suite.

If you want the tables to exist for all your tests, create a
`setupAfterEnv.js` file with the content:

```javascript
import "jest-dynalite/withDb";
```

You then must add the setup files to your jest config

jest.config.js

```javascript
module.exports = {
  ...
  setupFiles: ["./setupBeforeEnv.js"],
  setupFilesAfterEnv: ["./setupAfterEnv.js"]
}
```

If you want to use a more advanced setup, you can start
the db yourself at any point.

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

### Other options

setup.js

```javascript
import "jest-dynalite/dist/setupTables";

// Optional (but recommended)
import "jest-dynalite/dist/clearAfterEach";
```

jest.config.js

```javascript
module.exports = {
  ...
  testEnvironment: "jest-dynalite/dist/environment",
  setupFilesAfterEnv: ["./setup.js"]
}
```

This setup should be used if you want to override the default config of `clearAfterEach`.

## License

`MIT`
