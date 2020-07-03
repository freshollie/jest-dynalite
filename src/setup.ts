import { setConfigDir, getDynalitePort } from "./config";

let called = false;

export const isSetup = (): boolean => called;

export default (withConfigDir: string): void => {
  called = true;
  setConfigDir(withConfigDir);

  const port = getDynalitePort();

  // Provide environment variables before other scripts are executed
  process.env.MOCK_DYNAMODB_PORT = port.toString();
  process.env.MOCK_DYNAMODB_ENDPOINT = `localhost:${port}`;

  // aws-sdk requires access and secret key to be able to call DDB
  if (!process.env.AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = "access-key";
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = "secret-key";
  }
};
