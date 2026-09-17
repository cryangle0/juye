import { getDb, merchant, nid, now, save, addP, fail, ok } from '../lib/store.js';

export function applyResource(merchantId, resourceId) {
  const db = getDb();
  const r = db.resources.find((x) => x.id === resourceId);
  if (r.status === '已占用' && r.merchantId && r.merchantId !== merchantId) {
    db.resourceApps.unshift({ id: nid('RA'), merchantId, resourceId, status: '冲突驳回', at: now() });
    save();
    return fail('该时段已被占用，申请已拒');
  }
  db.resourceApps.unshift({ id: nid('RA'), merchantId, resourceId, status: '待审', at: now() });
  save();
  return ok('已提交排期申请');
}

export function approveResource(id, pass) {
  const db = getDb();
  const a = db.resourceApps.find((x) => x.id === id);
  const r = db.resources.find((x) => x.id === a.resourceId);
  if (!pass) { a.status = '已驳回'; save(); return ok('已驳回'); }
  if (r.status === '已占用' && r.merchantId !== a.merchantId) {
    a.status = '冲突驳回';
    save();
    return fail('审批时已撞档');
  }
  r.status = '已占用';
  r.merchantId = a.merchantId;
  a.status = '已通过';
  save();
  return ok('已占用日历');
}

export function exchangeResource(merchantId, resourceId, cost = 2000) {
  const db = getDb();
  const mer = merchant(merchantId);
  const r = db.resources.find((x) => x.id === resourceId);
  if (r.status === '已占用') return fail('资源冲突，兑换失败，积分未扣');
  if ((mer.pPoints || 0) < cost) return fail('产业积分不足');
  addP(merchantId, -cost, '消耗', '', '兑换 ' + r.kind);
  r.status = '已占用';
  r.merchantId = merchantId;
  db.exchanges.unshift({ id: nid('EX'), merchantId, item: r.kind, cost, status: '已占档', resourceId });
  save();
  return ok('已扣积分并占用排期');
}

export function decideLaunch(id, pass) {
  const l = getDb().launches.find((x) => x.id === id);
  l.status = pass ? '已通过' : '已驳回';
  save();
  return ok(l.status);
}

export function submitLaunch(merchantId, title) {
  getDb().launches.unshift({ id: nid('LN'), merchantId, title, status: '待审', at: now() });
  save();
  return ok('已提交提报');
}
