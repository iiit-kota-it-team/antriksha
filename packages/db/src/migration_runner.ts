import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const getClient = (): Client => {
  return new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });
};

const runMigrations = async () => {
  const client = getClient();

  try {
    await client.connect();

    await client.query(
      `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL UNIQUE,
        run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    );

    const migrationDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationDir).sort();

    for (const file of files) {
      const filePath = path.join(migrationDir, file);

      const res = await client.query(
        `SELECT * FROM migrations WHERE file_name = $1`,
        [file],
      );

      if (res.rows.length > 0) {
        console.log(`Skipping already-run migration: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf-8');
      await client.query(sql);

      await client.query(`INSERT INTO migrations (file_name) VALUES ($1)`, [
        file,
      ]);

      console.log(`Successfully ran migration: ${file}`);
    }
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
};

runMigrations().catch((err) => {
  console.error('Unexpected error during migrations:', err);
});
