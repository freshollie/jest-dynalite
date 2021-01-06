import type { CreateTableInput as LegacyCreateTableInput } from "aws-sdk/clients/dynamodb";

export type TableConfig = LegacyCreateTableInput & {
  data?: Record<string, unknown>[];
  TableName: string;
};

export type Config = {
  tables?: TableConfig[] | (() => TableConfig[] | Promise<TableConfig[]>);
  basePort?: number;
};
