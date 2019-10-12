# jest-dynalite

[![Pipeline status](https://github.com/freshollie/jest-dynalite/workflows/Pipeline/badge.svg)](https://github.com/freshollie/jest-dynalite/actions)
[![Npm version](https://img.shields.io/npm/v/jest-dynalite)](https://www.npmjs.com/package/jest-dynalite)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Enchanced `@shelf/jest-dynamodb`

`jest-dynalite` is a fork of `@shelf/jest-dynamodb` used to allow unit tests
to perform dynamodb queries locally.

## Behaviour

`jest-dynalite` runs a [dynalite](https://github.com/mhart/dynalite) instance per test runner, which means
test runners do not interfear with eachother.

`jest-dynalite` clears tables between tests, so every test has a clean environment to run in.

## Usage

```
yarn add jest-dynalite -D
```

jest.config.js

```javascript
module.exports = {
  ...
  preset: "jest-dynalite"
}
```

Create a `jest-dynalite-config.json` in your package root, which contain the tables
which should exist for your tests.

```json
{
  "tables": [
    {
      ...
    }
  ],
  "basePort": 8000
}
```

Usage

```javascript
const ddb = new DocumentClient({
  ...yourConfig,
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: "local"
  })
});
```

`process.env.MOCK_DYNAMODB_ENDPOINT` is unqiue to test runner

## License

`MIT`
