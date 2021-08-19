import tables from "../tables";

const realTimeout = setTimeout;
const sleep = (time: number): Promise<void> =>
  new Promise((resolve) => realTimeout(resolve, time));

export default {
  tables: async () => {
    await sleep(300);
    return tables;
  },
  basePort: 10500,
};
