import { deleteTables, createTables } from "./db";

afterEach(async () => {
  await deleteTables();
  await createTables();
});
