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

  declare class DynaliteServer extends Server {
    public close(cb?: (err?: Error) => void): void;
  }

  declare function createDynalite(options: DynaliteOptions): DynaliteServer;

  export default createDynalite;
}
