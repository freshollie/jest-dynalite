const tables = require("../tables");

const realTimeout = setTimeout;
const sleep = time => new Promise(resolve => realTimeout(resolve, time));

module.exports = {
  tables: async () => {
    await sleep(300);
    return tables;
  },
  basePort: 8000
};
