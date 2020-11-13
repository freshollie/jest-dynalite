const tables = require("./.jest/configs/tables");

// This is the simple jest-dynalite config used by most tests
// More advanced test configs can be found in .jest/configs
module.exports = {
  tables,
  basePort: 8000
};
