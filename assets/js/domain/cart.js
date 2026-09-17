import { getDb, product, member, save, fail, ok } from '../lib/store.js';
import { canSeeZone, checkLimited, levelOf, priceOf } from './catalog.js';

export function addCart(userId, productId, qty = 1) {
  const p = product(productId);
  if (!p) return fail('商品不存在');
  if (p.status !== '上架') return fail('未上架');
  const m = member(userId);
  if (!m) return fail('请先登录会员');
  if (!canSeeZone(m.level, p.zone)) return fail('当前等级不可购买该专区');
  if (p.zone === 'original' && p.type === 'unique' && !levelOf(userId).original) return fail('原作专区仅黑钻可下单');
  if (p.stock - p.locked < qty) return fail('库存不足');
  const lim = checkLimited(p, userId, qty);
  if (!lim.ok) return lim;
  const db = getDb();
  const row = db.cart.find((c) => c.userId === userId && c.productId === productId);
  if (row) row.qty += qty;
  else db.cart.push({ userId, productId, qty });
  save();
  return ok('已加入购物车');
}

export function quoteCart(userId, couponId, usePoints) {
  const db = getDb();
  const m = member(userId);
  const items = db.cart.filter((c) => c.userId === userId).map((c) => {
    const p = product(c.productId);
    const price = priceOf(p, m.level);
    return { ...c, p, price, sub: price * c.qty };
  });
  const groups = {};
  items.forEach((it) => {
    (groups[it.p.merchantId] ||= []).push(it);
  });
  const goods = items.reduce((s, it) => s + it.sub, 0);
  const freight = items.reduce((s, it) => s + (it.p.freight || 0), 0);
  const cp = db.coupons.find((x) => x.id === couponId && x.user === userId && x.status === '可用');
  const coupon = cp && goods >= cp.min ? cp.value : 0;
  let points = 0;
  const cap = Math.min(m.cPoints || 0, Math.floor(goods * db.config.pointOrderCap), db.config.pointDayCap);
  if (usePoints) points = Math.min(cap, Math.max(0, Math.floor((goods - coupon) * 0.5)));
  if (items.length && items.every((it) => it.p.noPoint || db.config.noPointCats.includes(it.p.zone))) points = 0;
  const pay = Math.max(0, goods - coupon - points + freight);
  return { items, groups, goods, freight, coupon, points, pay, couponId: cp ? cp.id : '' };
}

export function cartCount(userId) {
  return getDb().cart.filter((c) => c.userId === userId).reduce((s, c) => s + c.qty, 0);
}

export function changeCart(userId, productId, delta) {
  const db = getDb();
  const row = db.cart.find((c) => c.userId === userId && c.productId === productId);
  if (!row) return fail('购物车没有这件');
  row.qty += Number(delta || 0);
  if (row.qty <= 0) db.cart = db.cart.filter((c) => c !== row);
  save();
  return ok('购物车已更新');
}

export function removeCart(userId, productId) {
  const db = getDb();
  db.cart = db.cart.filter((c) => !(c.userId === userId && c.productId === productId));
  save();
  return ok('已移除');
}
