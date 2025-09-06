import { Router } from 'express';
import { calcTotal } from '../services/cart.js';
import { query } from '../db/pool.js';
export const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { items, user_id } = req.body;
    const total_cents = calcTotal(items);
    const rows = await query('INSERT INTO orders(user_id,total_cents,created_at) VALUES($1,$2,now()) RETURNING id', [user_id, total_cents]);
    res.status(201).json({ order_id: rows[0].id, total_cents });
  } catch (e) { next(e); }
});
