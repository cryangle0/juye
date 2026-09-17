import { seed } from '../data/seed.js';

const KEY = 'juye_proto_v5';
const SAVE_MS = 80;

let db = null;
let seq = 200;
let saveTimer = 0;
const listeners = new Set();

function reindex(target) {
  target._idx = {
    product: Object.create(null),
    member: Object.create(null),
    merchant: Object.create(null),
    order: Object.create(null),
  };
  for (const p of target.products) target._idx.product[p.id] = p;
  for (const m of target.members) target._idx.member[m.id] = m;
  for (const m of target.merchants) target._idx.merchant[m.id] = m;
  for (const o of target.orders) target._idx.order[o.id] = o;
}

export function getDb() {
  return db;
}

export function nid(prefix) {
  seq += 1;
  return prefix + seq;
}

export function now() {
  return db?.now || '2026-09-17 14:30';
}

export function product(id) { return db._idx.product[id]; }
export function member(id) { return db._idx.member[id]; }
export function merchant(id) { return db._idx.merchant[id]; }
export function order(id) { return db._idx.order[id] || db.orders.find((x) => x.id === id); }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => fn(db));
}

export function save(immediate = false) {
  reindex(db);
  const flush = () => {
    saveTimer = 0;
    try {
      const payload = { ...db };
      delete payload._idx;
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (_) {}
    emit();
  };
  if (immediate) {
    if (saveTimer) clearTimeout(saveTimer);
    flush();
    return;
  }
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, SAVE_MS);
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 5) {
        db = parsed;
        reindex(db);
        return db;
      }
    }
  } catch (_) {}
  db = seed();
  db.version = 5;
  reindex(db);
  save(true);
  return db;
}

export function reset() {
  localStorage.removeItem(KEY);
  db = seed();
  db.version = 5;
  seq = 200;
  reindex(db);
  save(true);
  return db;
}

export function audit(who, cat, action) {
  db.audits.unshift({ id: nid('AU'), who, action, at: now(), cat });
}

export function notify(title, body, go) {
  db.notifications.unshift({ id: nid('N'), title, body, time: '刚刚', read: false, go });
}

export function sendMsg(to, title, body) {
  db.messages.unshift({ id: nid('MSG'), to, title, body, at: now() });
}

export function addC(userId, delta, type, orderId, note) {
  db.pointsC.unshift({ id: nid('PC'), userId, delta, type, orderId, note, at: now() });
  const m = member(userId);
  if (m) m.cPoints = Math.max(0, (m.cPoints || 0) + delta);
}

export function addP(merchantId, delta, type, orderId, note) {
  db.pointsP.unshift({ id: nid('PP'), merchantId, delta, type, orderId, note, at: now() });
  const m = merchant(merchantId);
  if (m) m.pPoints = Math.max(0, (m.pPoints || 0) + delta);
}

export function ok(msg, extra = {}) { return { ok: true, msg, ...extra }; }
export function fail(msg) { return { ok: false, msg }; }
