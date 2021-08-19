import { join } from "path";
import base from "../jest.base";

export default {
  ...base,
  setupFiles: [join(__dirname, "setups/setupTablesFunctionTs.ts")],
  setupFilesAfterEnv: [join(__dirname, "setups/setupAdvancedEnv.ts")],
  displayName: {
    name: "tables-function-ts",
    color: "yellow",
  },
};
