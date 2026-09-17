import { getDb, product, nid, now, save, fail, ok } from '../lib/store.js';

export function depositCeremony(userId, productId) {
  const p = product(productId);
  const c = {
    id: nid('CM'), userId, productId, status: '已收定金',
    deposit: p.deposit || 2000, balance: p.guide - (p.deposit || 2000),
    paidDeposit: p.deposit || 2000, paidBalance: 0, phone: p.phone, deliver: false, at: now(),
  };
  getDb().ceremonies.unshift(c);
  save();
  return ok('定金已收，档期请电话/到店确认', { item: c });
}

export function payBalance(id) {
  const c = getDb().ceremonies.find((x) => x.id === id);
  if (!c) return fail('无单');
  c.paidBalance = c.balance;
  c.status = '尾款已付';
  save();
  return ok('尾款已付，待现场交付');
}

export function deliverCeremony(id) {
  const c = getDb().ceremonies.find((x) => x.id === id);
  if (!c) return fail('无单');
  c.deliver = true;
  c.status = '已交付';
  save();
  return ok('现场交付已确认');
}

export function refundDeposit(id) {
  const db = getDb();
  const c = db.ceremonies.find((x) => x.id === id);
  if (!c) return fail('无单');
  if (!db.config.depositRefundable) return fail('当前规则定金不可退');
  c.status = '定金已退';
  save();
  return ok('定金已按规则退回');
}

export function submitCustom(userId, productId, style, text, material) {
  getDb().customs.unshift({ id: nid('CU'), userId, productId, style, text, material, status: '待制作', at: now() });
  save();
  return ok('定制单已生成');
}

export function advanceCustom(id) {
  const c = getDb().customs.find((x) => x.id === id);
  const flow = ['待制作', '制作中', '待交付', '已交付'];
  const i = flow.indexOf(c.status);
  c.status = flow[Math.min(flow.length - 1, i + 1)];
  save();
  return ok('状态：' + c.status);
}
