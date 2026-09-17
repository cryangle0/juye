import { LEVELS } from '../data/constants.js';
import { getDb, member, nid, now, save, sendMsg, fail, ok } from '../lib/store.js';

export function bookSlot(userId, slotId, people = 2) {
  const db = getDb();
  const s = db.slots.find((x) => x.id === slotId);
  if (!s) return fail('无时段');
  if (s.used + people > s.cap) return fail('该时段名额已满，冲突不可占用');
  s.used += people;
  const b = { id: nid('BK'), userId, slotId, people, status: '成功', verifyCode: nid('YY-'), at: now() };
  db.bookings.unshift(b);
  sendMsg(userId, '预约成功', '凭证 ' + b.verifyCode);
  save();
  return ok('预约成功，凭证 ' + b.verifyCode, { booking: b });
}

export function cancelBook(id) {
  const db = getDb();
  const b = db.bookings.find((x) => x.id === id);
  if (!b || b.status === '已取消') return fail('无法取消');
  const s = db.slots.find((x) => x.id === b.slotId);
  if (s) s.used = Math.max(0, s.used - b.people);
  b.status = '已取消';
  sendMsg(b.userId, '预约已取消', '名额已释放');
  save();
  return ok('已取消并释放名额');
}

export function changeBook(id, slotId) {
  const db = getDb();
  const b = db.bookings.find((x) => x.id === id);
  if (!b) return fail('无预约');
  const ns = db.slots.find((x) => x.id === slotId);
  if (!ns) return fail('无时段');
  if (ns.used + b.people > ns.cap) return fail('目标时段冲突');
  const os = db.slots.find((x) => x.id === b.slotId);
  if (os) os.used = Math.max(0, os.used - b.people);
  ns.used += b.people;
  b.slotId = slotId;
  sendMsg(b.userId, '改约成功', '新时段已占用');
  save();
  return ok('改约成功');
}

export function signupEvent(userId, eventId) {
  const db = getDb();
  const e = db.events.find((x) => x.id === eventId);
  const m = member(userId);
  if (!e || !m) return fail('无法报名');
  const need = LEVELS.find((l) => l.id === e.need);
  const have = LEVELS.find((l) => l.id === m.level);
  if (need && have && LEVELS.indexOf(have) < LEVELS.indexOf(need)) return fail('等级不足，专场资格已拦截');
  if (e.tags?.length && !(m.tags || []).some((t) => e.tags.includes(t))) return fail('标签不符，已拦截');
  if (db.signups.some((s) => s.eventId === eventId && s.userId === userId && s.status !== '已取消')) return fail('已报名');
  if (e.used < e.cap) {
    e.used += 1;
    const s = { id: nid('SG'), eventId, userId, status: '成功', queue: 0, code: nid('QD-'), at: now() };
    db.signups.unshift(s);
    sendMsg(userId, '报名成功', `${e.name} 签到码 ${s.code}`);
    save();
    return ok('报名成功，签到码 ' + s.code);
  }
  e.wait += 1;
  const s = { id: nid('SG'), eventId, userId, status: '候补', queue: e.wait, code: '', at: now() };
  db.signups.unshift(s);
  sendMsg(userId, '已进候补', `${e.name} 第 ${e.wait} 位`);
  save();
  return ok('满员，已进入候补队列第 ' + e.wait + ' 位');
}

export function cancelSignup(id) {
  const db = getDb();
  const s = db.signups.find((x) => x.id === id);
  if (!s) return fail('无报名');
  const e = db.events.find((x) => x.id === s.eventId);
  const was = s.status;
  s.status = '已取消';
  if (was === '成功' && e) {
    e.used = Math.max(0, e.used - 1);
    const wait = db.signups.filter((x) => x.eventId === s.eventId && x.status === '候补').sort((a, b) => a.queue - b.queue)[0];
    if (wait) {
      wait.status = '成功';
      wait.code = nid('QD-');
      e.used += 1;
      e.wait = Math.max(0, e.wait - 1);
      sendMsg(wait.userId, '候补转正', `${e.name} 签到码 ${wait.code}`);
    }
  }
  if (was === '候补' && e) e.wait = Math.max(0, e.wait - 1);
  save();
  return ok(was === '成功' ? '已取消，名额已补给候补' : '已退出候补');
}
