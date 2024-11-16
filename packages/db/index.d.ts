declare module "@fest/db" {
  import { QueryResult } from "pg";

  export function query(
    text: string,
    params?: any[],
  ): Promise<QueryResult<any>>;
}
