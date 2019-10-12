# jest-dynalite

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
  preset: "./jest-preset.js"
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
