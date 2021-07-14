declare module "dynalite" {
  import { Server } from "http";

  interface DynaliteOptions {
    ssl?: boolean;
    path?: string;
    createTableMs?: number;
    deleteTableMs?: number;
    updateTableMs?: number;
    maxItemSizeKb?: number;
  }

  function createDynalite(
    options: DynaliteOptions
  ): Server & { close(cb?: (err?: Error) => void | undefined): void };

  export default createDynalite;
}
