import { join } from "path";
import base from "../jest.base";

export default {
  ...base,
  // TODO: use testEnvironment when jest 27 arrives
  setupFiles: [join(__dirname, "setups/setupAdvanced.ts")],
  setupFilesAfterEnv: [join(__dirname, "setups/setupSimple.ts")],
  displayName: {
    name: "simple",
    color: "magenta",
  },
};
