import request from 'supertest';
import { createServer } from '../src/server.js';
import { pool } from '../src/db/pool.js';

const app = createServer();

describe('api integration (db)', () => {
  beforeAll(async () => {
    // ensure schema and seed minimal fixture row
    await pool.query('CREATE TABLE IF NOT EXISTS products(id INT PRIMARY KEY, name TEXT, price NUMERIC(10,2));');
    await pool.query('INSERT INTO products(id,name,price) VALUES(1,\'Widget\',9.99) ON CONFLICT (id) DO NOTHING');
  });
  afterAll(async () => { await pool.end(); });

  it('GET /products returns rows', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
  });
});
