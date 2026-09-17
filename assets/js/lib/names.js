import { LEVELS, ZONES } from '../data/constants.js';

export function productName(db, id) {
  return db.products.find((p) => p.id === id)?.name || id;
}
export function merchantName(db, id) {
  return db.merchants.find((m) => m.id === id)?.name || id;
}
export function memberName(db, id) {
  return db.members.find((m) => m.id === id)?.name || id;
}
export function levelName(id) {
  return LEVELS.find((l) => l.id === id)?.name || '游客';
}
export function zoneName(id) {
  return ZONES.find((z) => z.id === id)?.name || id;
}
export function matchQuery(row, query, keys) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  return keys.some((k) => String(row[k] || '').toLowerCase().includes(q));
}
