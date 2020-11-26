import { startDb, stopDb, createTables, deleteTables } from "../../src";

beforeAll(startDb);

// Create tables but don't delete them after tests
// beforeAll(createTables);

// Optional
beforeEach(createTables);
afterEach(deleteTables);

afterAll(stopDb);
