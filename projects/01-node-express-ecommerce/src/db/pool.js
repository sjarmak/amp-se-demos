import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function query(sql, params) {
  const res = await pool.query(sql, params);
  return res.rows;
}
