import { Router } from 'express';
import { query } from '../db/pool.js';
export const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const rows = await query('SELECT id, name, price FROM products ORDER BY id');
    res.json(rows);
  } catch (e) { next(e); }
});
