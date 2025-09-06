import { calcTotal } from '../src/services/cart.js';

describe('cart service', () => {
  it('sums items', () => {
    const total = calcTotal([{ price_cents: 100, qty: 2 }, { price_cents: 50 }]);
    expect(total).toBe(250);
  });
  it('applies discount and floors at zero', () => {
    const total = calcTotal([{ price_cents: 100 }, { type: 'discount', amount_cents: 200 }]);
    expect(total).toBe(0);
  });
});
