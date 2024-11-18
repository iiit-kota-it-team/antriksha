declare module "@fest/db" {
  import { QueryResult, QueryResultRow } from "pg";

  export function query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
}
