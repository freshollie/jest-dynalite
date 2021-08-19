import { join } from "path";
import base from "../jest.base";

export default {
  ...base,
  setupFiles: [join(__dirname, "setups/setupAdvanced.ts")],
  setupFilesAfterEnv: [
    join(__dirname, "setups/setupDynamodbV2.ts"),
    join(__dirname, "setups/setupSimple.ts"),
  ],
  displayName: {
    name: "sdk-v2",
    color: "red",
  },
};
