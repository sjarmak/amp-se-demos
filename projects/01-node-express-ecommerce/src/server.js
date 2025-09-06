import express from 'express';
import { router as health } from './routes/health.js';
import { router as products } from './routes/products.js';
import { router as checkout } from './routes/checkout.js';

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use('/health', health);
  app.use('/products', products);
  app.use('/checkout', checkout);
  return app;
}
