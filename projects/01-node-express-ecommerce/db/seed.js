import fs from 'fs';
import path from 'path';
import { pool } from '../src/db/pool.js';

async function main() {
  const root = path.resolve(process.cwd(), '../../datasets/ecommerce');
  const prod = fs.readFileSync(path.join(root, 'products.csv'), 'utf-8').trim().split('\n').slice(1);
  const users = fs.readFileSync(path.join(root, 'users.csv'), 'utf-8').trim().split('\n').slice(1);
  const orders = fs.readFileSync(path.join(root, 'orders.csv'), 'utf-8').trim().split('\n').slice(1);

  await pool.query(fs.readFileSync(path.join(process.cwd(), 'db/schema.sql'), 'utf-8'));

  for (const line of prod) {
    const [id,name,price] = line.split(',');
    await pool.query('INSERT INTO products(id,name,price) VALUES($1,$2,$3) ON CONFLICT (id) DO NOTHING', [id, name, price]);
  }
  for (const line of users) {
    const [id,email,created_at] = line.split(',');
    await pool.query('INSERT INTO users(id,email,created_at) VALUES($1,$2,$3) ON CONFLICT (id) DO NOTHING', [id, email, created_at]);
  }
  for (const line of orders) {
    const [id,user_id,total_cents,created_at] = line.split(',');
    await pool.query('INSERT INTO orders(id,user_id,total_cents,created_at) VALUES($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING', [id, user_id, total_cents, created_at]);
  }
  console.log('seeded');
  await pool.end();
}
main().catch(e=>{ console.error(e); process.exit(1); });
