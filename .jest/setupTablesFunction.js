const { join } = require("path");
const { setup } = require("../dist");

// Setup with the config dir
setup(join(__dirname, "configs", "tables-function"));
