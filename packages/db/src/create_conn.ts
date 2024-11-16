import { Pool, QueryResult } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

console.log(
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME,
  process.env.DB_HOST,
  Number(process.env.DB_PORT),
);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

export const query = (
  text: string,
  params?: any[],
): Promise<QueryResult<any>> => {
  return pool.query(text, params);
};
