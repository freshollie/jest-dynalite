import NodeEnvironment from "jest-environment-node";
import dynalite from "dynalite";
import config from "./config";

const port =
  (config.basePort || 8000) +
  parseInt(process.env.JEST_WORKER_ID as string, 10);

process.env.MOCK_DYNAMODB_PORT = port.toString();
process.env.MOCK_DYNAMODB_ENDPOINT = `localhost:${port}`;

// aws-sdk requires access and secret key to be able to call DDB
process.env.AWS_ACCESS_KEY_ID = "access-key";
process.env.AWS_SECRET_ACCESS_KEY = "secret-key";

export default class DynaliteEnvironment extends NodeEnvironment {
  private dynaliteInstance = dynalite({
    createTableMs: 0,
    deleteTableMs: 0,
    updateTableMs: 0
  });

  public async setup(): Promise<void> {
    await super.setup();

    await new Promise(resolve =>
      this.dynaliteInstance.listen(
        parseInt(process.env.MOCK_DYNAMODB_PORT as string, 10),
        resolve
      )
    );
  }

  async teardown(): Promise<void> {
    await new Promise(resolve => this.dynaliteInstance.close(resolve));
    await super.teardown();
  }
}
