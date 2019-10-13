const { startDb, stopDb, createTables, deleteTables } = require("../dist");

beforeAll(startDb);

// Create tables but don't delete them after tests
// beforeAll(createTables);

// Optional
beforeEach(createTables);
afterEach(deleteTables);

afterAll(stopDb);
