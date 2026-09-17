import { getDb, nid, save, addC, fail, ok } from '../lib/store.js';

export function reviewPass(id, pass) {
  const r = getDb().reviews.find((x) => x.id === id);
  r.status = pass ? '已过审' : '驳回';
  save();
  return ok(pass ? '已上墙' : '未过审不上墙');
}

export function ugcPass(id, pass) {
  const db = getDb();
  const u = db.ugc.find((x) => x.id === id);
  if (pass) {
    const dup = db.ugc.filter((x) => x.userId === u.userId && x.event === u.event && x.status === '已过审' && x.id !== u.id);
    if (dup.length) return fail('同一活动已发分，去重拦截');
    u.status = '已过审';
    addC(u.userId, u.points, '获取', '', '打卡积分');
  } else u.status = '驳回';
  save();
  return ok(pass ? '已发积分入 C 池' : '已驳回');
}

export function inviteAccept(from, to) {
  const db = getDb();
  if (db.invites.some((i) => i.to === to)) return fail('该用户已被邀请过（仅一层）');
  db.invites.unshift({ id: nid('IN'), from, to, status: '已注册', points: 0 });
  save();
  return ok('邀请绑定成功，待首单发分');
}

export function grantCoupon(userId, tplId = 'TPL1') {
  const db = getDb();
  const tpl = db.couponTpls.find((t) => t.id === tplId) || db.couponTpls[0];
  if (tpl.once && db.coupons.some((c) => c.user === userId && c.name === tpl.name)) return fail('同一用户只能领一次');
  db.coupons.push({ id: nid('C'), name: tpl.name, type: 'cash', value: tpl.value, min: tpl.min, status: '可用', user: userId });
  save();
  return ok('已发放 ' + tpl.name);
}

export function toggleMemberDay() {
  const d = getDb().memberDay;
  d.on = !d.on;
  save();
  return ok(d.on ? '会员日已开启' : '会员日已关闭，价格已恢复');
}

export function replyReview(id, text) {
  const r = getDb().reviews.find((x) => x.id === id);
  r.reply = text;
  save();
  return ok('已回复');
}

export function submitReview(userId, productId, text) {
  getDb().reviews.unshift({ id: nid('RV'), productId, userId, score: 5, text, status: '待审', reply: '', at: getDb().now });
  save();
  return ok('评价已提交，先审后发');
}

export function submitUgc(userId, text) {
  getDb().ugc.unshift({ id: nid('UG'), userId, event: '工坊打卡', text, status: '待审', points: 20, at: getDb().now });
  save();
  return ok('打卡已提交，审过再发分');
}
