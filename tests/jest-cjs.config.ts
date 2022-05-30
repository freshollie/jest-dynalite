import { join } from "path";
import base from "../jest.base";

export default {
  ...base,
  setupFiles: [join(__dirname, "setups/setupCjs.ts")],
  setupFilesAfterEnv: [join(__dirname, "setups/setupAdvancedEnv.ts")],
  displayName: {
    name: "cjs",
    color: "yellow",
  },
};
