import { getDb, member, nid, now, save, addC, fail, ok } from '../lib/store.js';

export function verifyCode(code, by = 'store') {
  const db = getDb();
  const o = db.orders.find((x) => x.verifyCode === code);
  const bk = db.bookings.find((x) => x.verifyCode === code);
  const sg = db.signups.find((x) => x.code === code);
  if (o) {
    if (o.status === '已核销' || o.status === '已完成') return fail('核销码已使用，不可重复核销');
    if (o.status !== '待核销') return fail('订单状态不可核销');
    o.status = '已核销';
    db.verifies.unshift({ id: nid('V'), code, orderId: o.id, user: member(o.userId)?.name, status: '已核销', at: now(), by });
    addC(o.userId, 20, '获取', o.id, '到店核销奖励');
    save();
    return ok('核销成功 ' + o.id);
  }
  if (bk) {
    if (bk.status === '已核销') return fail('预约凭证已核销');
    bk.status = '已核销';
    db.verifies.unshift({ id: nid('V'), code, orderId: bk.id, user: member(bk.userId)?.name, status: '已核销', at: now(), by });
    save();
    return ok('预约到店核销成功');
  }
  if (sg) {
    if (sg.status === '已签到') return fail('已签到');
    if (sg.status !== '成功') return fail('候补未转正，不可签到');
    sg.status = '已签到';
    db.verifies.unshift({ id: nid('V'), code, orderId: sg.id, user: member(sg.userId)?.name, status: '已签到', at: now(), by });
    save();
    return ok('活动签到成功');
  }
  return fail('无效核销码');
}
