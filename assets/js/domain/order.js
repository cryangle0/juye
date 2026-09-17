import { LEVELS } from '../data/constants.js';
import {
  getDb, product, member, merchant, order, nid, now, save, audit, notify,
  addC, addP, fail, ok,
} from '../lib/store.js';
import { checkLimited } from './catalog.js';
import { quoteCart } from './cart.js';

export function checkout(userId, couponId, usePoints, fulfill, payKind = 'full') {
  const q = quoteCart(userId, couponId, usePoints);
  if (!q.items.length) return fail('购物车是空的，先去选一件');
  for (const it of q.items) {
    if (it.p.stock - it.p.locked < it.qty) return fail(it.p.name + ' 库存不足');
    if (it.p.type === 'unique' && it.p.stock < 1) return fail('孤品已售出');
    const lim = checkLimited(it.p, userId, it.qty);
    if (!lim.ok) return lim;
  }
  const depositOnly = payKind === 'deposit';
  if (depositOnly && q.items.some((it) => !it.p.presale)) return fail('购物车含非预售商品，不能只付定金');
  q.items.forEach((it) => { it.p.locked += it.qty; });
  const db = getDb();
  const orders = Object.keys(q.groups).map((mid) => {
    const its = q.groups[mid];
    const p0 = its[0].p;
    const type = p0.type === 'diy' || p0.type === 'card' ? '核销单'
      : p0.type === 'custom' || p0.type === 'ceremony' ? '定制单'
        : (depositOnly ? '预售单' : '购物单');
    const amount = depositOnly
      ? its.reduce((s, it) => s + (it.p.deposit || 0) * it.qty, 0)
      : its.reduce((s, it) => s + it.sub, 0);
    const o = {
      id: nid('O'), userId, merchantId: mid, type, status: '待支付', pay: '待支付', payNo: '',
      items: its.map((it) => ({ productId: it.productId, qty: it.qty, price: depositOnly ? (it.p.deposit || 0) : it.price })),
      amount,
      freight: depositOnly ? 0 : its.reduce((s, it) => s + (it.p.freight || 0), 0),
      coupon: 0, points: 0, payKind: depositOnly ? '定金' : '全款',
      fulfill: fulfill || (p0.verify ? '到店核销' : '快递'),
      created: now(), express: '', verifyCode: p0.verify ? nid('HX-') : '',
      timesLeft: p0.type === 'card' ? (p0.times || 1) : 0,
      times: p0.type === 'card' ? (p0.times || 1) : 0,
    };
    db.orders.unshift(o);
    db._idx.order[o.id] = o;
    return o;
  });
  if (q.coupon && couponId) {
    const cp = db.coupons.find((x) => x.id === couponId);
    if (cp) cp.status = '占用';
    orders[0].coupon = q.coupon;
  }
  orders[0].points = q.points;
  db.cart = db.cart.filter((c) => c.userId !== userId);
  audit('system', '下单', `${userId} 拆 ${orders.length} 子单并锁库`);
  save();
  return ok('已锁库，请完成支付', { orders, pay: q.pay });
}

export function payOrder(orderId, channel = '微信') {
  const o = order(orderId);
  if (!o || o.status !== '待支付') return fail('订单不可支付');
  const db = getDb();
  o.items.forEach((it) => {
    const p = product(it.productId);
    p.locked = Math.max(0, p.locked - it.qty);
    p.stock = Math.max(0, p.stock - it.qty);
    if (p.type === 'unique') {
      p.stock = 0;
      const c = db.codes.find((x) => x.id === p.code);
      if (c) { c.status = '已售'; c.owner = o.userId; }
    }
  });
  o.status = o.verifyCode ? '待核销' : (o.type === '定制单' || o.payKind === '定金' ? '待履约' : '待发货');
  o.pay = channel + '已付';
  o.payNo = nid(channel === '支付宝' ? 'ALI' : 'WX');
  const m = member(o.userId);
  if (m) {
    m.spend += o.amount;
    m.growth += o.amount;
    const next = [...LEVELS].reverse().find((l) => m.growth >= l.threshold);
    if (next && LEVELS.findIndex((l) => l.id === next.id) > LEVELS.findIndex((l) => l.id === m.level)) {
      m.level = next.id;
      db.coupons.push({ id: nid('C'), name: '晋级礼券', type: 'cash', value: 80, min: 0, status: '可用', user: m.id });
      notify('会员升级', `${m.name} → ${next.name}`, 'members');
    }
    addC(m.id, Math.floor(o.amount * db.config.pointRate), '获取', o.id, '消费积分');
    if (o.points) addC(m.id, -o.points, '消耗', o.id, '抵现');
    const inv = db.invites.find((i) => i.to === o.userId && i.status === '已注册');
    if (inv) {
      inv.status = '已首单';
      inv.points = 50;
      addC(inv.from, 50, '获取', o.id, '邀请首单奖励（仅一层）');
    }
  }
  const mer = merchant(o.merchantId);
  const tier = db.tiers.find((t) => t.id === mer.tier);
  const rate = tier ? tier.rate : 0.82;
  addP(o.merchantId, Math.floor(o.amount * rate * 0.02), '分成入账', o.id, '产业积分');
  (db.splits ||= []).unshift({
    id: nid('SP'), orderId: o.id, merchantId: o.merchantId,
    goods: o.amount, merchant: Math.round(o.amount * rate), platform: Math.round(o.amount * (1 - rate)),
    status: '已调甲方清分', at: now(),
  });
  if (o.coupon) {
    const cp = db.coupons.find((x) => x.user === o.userId && x.status === '占用');
    if (cp) cp.status = '已用';
  }
  audit('system', '支付', `${o.id} ${o.payNo} ${channel}`);
  save();
  return ok(channel + '支付成功');
}

export function releaseTimeout() {
  const db = getDb();
  const list = db.orders.filter((o) => o.status === '待支付');
  list.forEach((o) => cancelUnpaid(o.id));
  return ok(list.length ? `已释放 ${list.length} 笔超时未付` : '没有超时未付订单');
}

export function simulateInviteFirstOrder(from) {
  const db = getDb();
  const inv = db.invites.find((i) => i.from === from && i.status === '已注册');
  if (!inv) return fail('没有待首单的邀请，请先模拟好友用码注册');
  const p = product('P01');
  if (!p) return fail('无演示商品');
  const o = {
    id: nid('O'), userId: inv.to, merchantId: p.merchantId, type: '购物单', status: '待支付',
    pay: '待支付', payNo: '', items: [{ productId: p.id, qty: 1, price: p.member?.l1 || p.guide }],
    amount: p.member?.l1 || p.guide, freight: p.freight || 0, coupon: 0, points: 0,
    fulfill: '快递', created: now(), express: '',
  };
  db.orders.unshift(o);
  db._idx.order[o.id] = o;
  save();
  return payOrder(o.id);
}

export function applyInvoice(orderId, kind, title, tax) {
  const o = order(orderId);
  if (!o) return fail('无订单');
  getDb().invoices.unshift({
    id: nid('INV'), orderId, kind: kind || '个人', title: title || '', tax: tax || '',
    status: '待开', no: '',
  });
  save();
  return ok('发票申请已提交，待财务回填');
}

export function cancelUnpaid(orderId) {
  const o = order(orderId);
  if (!o || o.status !== '待支付') return fail('无法取消');
  o.items.forEach((it) => {
    const p = product(it.productId);
    p.locked = Math.max(0, p.locked - it.qty);
  });
  o.status = '已取消';
  const cp = getDb().coupons.find((x) => x.user === o.userId && x.status === '占用');
  if (cp) cp.status = '可用';
  save();
  return ok('已取消并释放库存');
}

export function ship(orderId, no) {
  const o = order(orderId);
  if (!o) return fail('无订单');
  o.express = no || nid('SF');
  o.status = '已发货';
  o.trace = ['已揽收'];
  save();
  return ok('已发货 ' + o.express);
}

export function complete(orderId) {
  const o = order(orderId);
  if (!o) return fail('无订单');
  o.status = '已完成';
  (o.trace ||= []).push('已签收');
  save();
  return ok('订单完成');
}

export function applyAftersale(orderId, type, reason) {
  const o = order(orderId);
  if (!o) return fail('无订单');
  const art = o.items.some((i) => {
    const p = product(i.productId);
    return p && (p.zone === 'original' || p.type === 'unique');
  });
  getDb().aftersales.unshift({
    id: nid('AS'), orderId, type,
    status: art ? '待运营放行' : '待审',
    reason, amount: o.amount + (o.freight || 0) - (o.points || 0),
    artOverride: art, created: now(),
  });
  o.status = '售后中';
  save();
  return ok(art ? '原作默认不退，已提交运营放行' : '已提交售后');
}

export function decideAftersale(id, pass, who) {
  const db = getDb();
  const a = db.aftersales.find((x) => x.id === id);
  if (!a) return fail('无工单');
  a.status = pass ? '已退款' : '已驳回';
  const o = order(a.orderId);
  if (pass) {
    o.status = '已退款';
    o.items.forEach((it) => {
      const p = product(it.productId);
      if (p.type !== 'unique') p.stock += it.qty;
    });
    if (o.points) addC(o.userId, o.points, '退返', o.id, '售后回退抵现积分');
    const got = db.pointsC.find((x) => x.orderId === o.id && x.type === '获取');
    if (got) addC(o.userId, -got.delta, '退返', o.id, '回退消费积分');
    const cp = db.coupons.find((x) => x.user === o.userId && x.status === '已用');
    if (cp && o.coupon) cp.status = '可用';
    audit(who, '退款', `${a.id} ${a.amount}`);
  } else o.status = '已发货';
  save();
  return ok(pass ? '已退款并回退积分/券' : '已驳回');
}
