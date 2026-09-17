import { getDb, nid, now, save, audit, fail, ok } from '../lib/store.js';

export function approveInquiry(id, pass, who) {
  const db = getDb();
  const q = db.inquiries.find((x) => x.id === id);
  if (!q) return fail('无询价单');
  if (!pass) { q.status = '已驳回'; save(); return ok('已驳回'); }
  q.status = '已转订单';
  const price = [...q.ladders].reverse().find((l) => q.qty >= l.n)?.p || q.ladders[0].p;
  db.bulkOrders.unshift({
    id: nid('BO'), ent: q.ent, productId: 'P11', qty: q.qty,
    amount: price * q.qty, status: '待支付', addresses: 1, at: now(), fromInquiry: q.id,
  });
  audit(who, '对公认领', '询价转单 ' + q.id);
  save();
  return ok('审批通过，已转正式订单');
}

export function claimPay(id, who) {
  const db = getDb();
  const c = db.claims.find((x) => x.id === id);
  if (!c) return fail('无认领单');
  c.status = '已认领';
  const o = db.bulkOrders.find((x) => x.id === c.orderId);
  if (o) o.status = '已支付待发货';
  audit(who, '对公认领', `认领 ${c.amount} 绑 ${c.orderId}`);
  save();
  return ok('对公款已认领到订单');
}

export function addBulk(ent, qty = 50) {
  getDb().bulkOrders.unshift({
    id: nid('BO'), ent, productId: 'P11', qty, amount: 268 * qty,
    status: '待对公认领', addresses: 1, at: now(),
  });
  save();
  return ok('批量单已创建');
}

export function addInquiry(ent, title) {
  getDb().inquiries.unshift({
    id: nid('IQ'), ent, title: title || '新询价', qty: 800, status: '待审批',
    ladders: [{ n: 200, p: 258 }, { n: 500, p: 248 }, { n: 800, p: 238 }],
    valid: '2026-10-01', at: now(),
  });
  save();
  return ok('询价已提交');
}

export function addLogo(ent) {
  getDb().logos.unshift({
    id: nid('LG'), ent, qty: 300, logo: '新Logo.ai', due: '2026-10-20',
    status: '待设计', quote: 9600, at: now(),
  });
  save();
  return ok('提报已提交');
}

export function advanceLogo(id) {
  const l = getDb().logos.find((x) => x.id === id);
  const flow = ['待设计', '设计确认', '报价回传', '生产中', '已交付'];
  const i = Math.max(0, flow.indexOf(l.status));
  l.status = flow[Math.min(flow.length - 1, i + 1)];
  save();
  return ok('状态：' + l.status);
}

export function fillInvoice(id, no) {
  const i = getDb().invoices.find((x) => x.id === id);
  i.no = no || nid('INV');
  i.status = '已回填';
  save();
  return ok('票号已回填');
}
