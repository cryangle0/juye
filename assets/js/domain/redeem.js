import { getDb, nid, now, save, addC, fail, ok } from '../lib/store.js';

export function redeemPoints(userId, itemId) {
  const db = getDb();
  const item = db.redeemItems.find((x) => x.id === itemId);
  const m = db.members.find((x) => x.id === userId);
  if (!item || !m) return fail('无法兑换');
  if ((m.cPoints || 0) < item.cost) return fail('积分不足');
  addC(userId, -item.cost, '消耗', '', '兑换 ' + item.name);
  const v = { id: nid('RD'), userId, itemId, name: item.name, code: nid('DH-'), status: '待核销', at: now() };
  db.redeemVouchers.unshift(v);
  save();
  return ok('已扣积分，凭证 ' + v.code, { voucher: v });
}

export function grantBirthday(userId) {
  const db = getDb();
  const m = db.members.find((x) => x.id === userId);
  if (!m) return fail('无会员');
  const key = '生日礼 ' + (db.now || '').slice(0, 4);
  if (db.coupons.some((c) => c.user === userId && c.name === key)) return fail('本年生日礼已发');
  db.coupons.push({ id: nid('C'), name: key, type: 'cash', value: 50, min: 0, status: '可用', user: userId });
  save();
  return ok('已发放生日礼券');
}

export function expirePoints(userId, n = 10) {
  const m = getDb().members.find((x) => x.id === userId);
  if (!m) return fail('无会员');
  if ((m.cPoints || 0) < n) return fail('积分不足，无法演示过期');
  addC(userId, -n, '过期', '', '年度过期（演示）');
  save();
  return ok(`已过期 ${n} 分`);
}
