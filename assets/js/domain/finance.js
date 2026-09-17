import { getDb, nid, now, save, audit, addC, addP, fail, ok } from '../lib/store.js';

export function withdraw(merchantId, amount) {
  getDb().withdraws.unshift({ id: nid('W'), merchantId, amount, status: '待财务审', at: now() });
  save();
  return ok('提现已提交');
}

export function approveWithdraw(id, pass, who) {
  const w = getDb().withdraws.find((x) => x.id === id);
  w.status = pass ? '已打款' : '已驳回';
  audit(who, '分账', (pass ? '打款 ' : '驳回 ') + w.id);
  save();
  return ok(w.status);
}

export function transferPoints(userId, merchantId, cAmount) {
  const db = getDb();
  const rate = db.config.transferRate || 10;
  addC(userId, -cAmount, '消耗', '', '划转至 P 池');
  addP(merchantId, Math.floor(cAmount / rate), '获取', '', 'C 池划入');
  save();
  return ok(`已按 1:${rate} 划转（指定场景）`);
}

export function billAppeal(id, note) {
  const b = getDb().bills.find((x) => x.id === id);
  b.appeal = note;
  b.status = '申诉中';
  save();
  return ok('申诉备注已记录');
}
