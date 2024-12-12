declare module '@fest/db' {
  import { QueryResult, QueryResultRow } from 'pg';

  export function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
}
