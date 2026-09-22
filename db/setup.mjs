import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function runSqlFile(relativePath) {
  const text = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const statements = text
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await sql.query(statement);
  }
}

console.log('Applying schema...');
await runSqlFile('./schema.sql');
console.log('Schema applied.');

console.log('Applying seed...');
await runSqlFile('./seed.sql');
console.log('Seed applied.');

const restaurants = await sql.query('SELECT * FROM restaurants');
const reviews = await sql.query('SELECT * FROM reviews ORDER BY created_at');

console.table(restaurants);
console.table(reviews);