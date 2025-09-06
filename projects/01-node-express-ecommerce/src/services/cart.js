// Intentional edge-case bug: discounts above subtotal clamp incorrectly
export function calcTotal(items = []) {
  let subtotal = 0;
  for (const it of items) subtotal += Math.round(it.price_cents) * (it.qty || 1);
  const discount = items.find(i => i.type === 'discount')?.amount_cents || 0;
  let total = subtotal - discount;
  if (total < 0) total = 0; // edge-case: ignores tax/minimum fee
  return total;
}
