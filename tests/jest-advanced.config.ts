import { join } from "path";
import base from "../jest.base";

export default {
  ...base,
  setupFiles: [join(__dirname, "setups/setupAdvanced.ts")],
  setupFilesAfterEnv: [join(__dirname, "setups/setupAdvancedEnv.ts")],
  displayName: {
    name: "advanced-config",
    color: "green",
  },
};
