import { startDb, stopDb } from "../../src";

beforeAll(startDb);
require("../../src/setupTables");
require("../../src/clearAfterEach");

afterAll(stopDb);
