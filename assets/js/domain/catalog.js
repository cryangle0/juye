import { LEVELS } from '../data/constants.js';
import { getDb, product, member, merchant, save, audit, fail, ok, now, nid } from '../lib/store.js';

export function levelOf(uid) {
  const m = member(uid);
  if (!m) return LEVELS[0];
  return LEVELS.find((l) => l.id === m.level) || LEVELS[0];
}

export function canSeeZone(levelId, zone) {
  const lv = LEVELS.find((l) => l.id === levelId);
  if (!lv) return zone === 'craft';
  return lv.zones.includes(zone);
}

export function canSeeNft(levelId) {
  return !!LEVELS.find((l) => l.id === levelId)?.nft;
}

export function priceOf(p, levelId) {
  if (!p) return 0;
  const db = getDb();
  const base = (p.member && p.member[levelId]) || p.guide;
  if (db.memberDay.on && !p.noPoint) return Math.round(base * (1 - (db.memberDay.extraOff || 0)));
  return base;
}

export function checkLimited(p, userId, qty) {
  if (!p.limited) return ok('');
  const db = getDb();
  if (p.saleAt && p.saleAt > now() && !p.presale) return fail('未到开售时间 ' + p.saleAt);
  const bought = db.orders
    .filter((o) => o.userId === userId && o.status !== '已取消')
    .reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((a, i) => a + i.qty, 0), 0);
  if (bought + qty > (p.limitPer || 1)) return fail('超过限购 ' + (p.limitPer || 1) + ' 件');
  return ok('');
}

export function auditMerchant(id, pass, reason, who) {
  const m = merchant(id);
  if (!m) return fail('无商家');
  m.status = pass ? '通过' : '驳回';
  m.reason = reason || '';
  audit(who, '入驻审核', (pass ? '通过 ' : '驳回 ') + m.name + (reason ? '：' + reason : ''));
  save();
  return ok(pass ? '已开通商家后台' : '已驳回并回传原因');
}

export function auditProduct(id, pass, reason, who) {
  const p = product(id);
  if (!p) return fail('无商品');
  p.status = pass ? '上架' : (reason === '运营下架' ? '下架' : '驳回');
  p.reason = reason || '';
  audit(who, '商品审核', (pass ? '上架 ' : (p.status + ' ')) + p.name);
  save();
  return ok(pass ? '已上架' : (p.status === '下架' ? '已下架' : '已驳回'));
}

export function adjustStock(id, delta) {
  const p = product(id);
  p.stock = Math.max(0, p.stock + Number(delta || 0));
  save();
  return ok('库存已调整');
}

export function setSaleAt(id, saleAt) {
  const p = product(id);
  p.saleAt = saleAt;
  save();
  return ok('开售时间已更新：' + saleAt);
}

export function lookupTrace(code) {
  const t = getDb().traces.find((x) => x.code === code);
  if (!t) return fail('甲方存证接口无此编码（演示）');
  return ok('查到存证', { data: t });
}

export function saveTraceNo(code, trace) {
  const c = getDb().codes.find((x) => x.id === code);
  if (!c) return fail('无编码');
  c.trace = trace;
  save();
  return ok('已保存存证编号');
}

export function submitProduct(merchantId, name) {
  const db = getDb();
  const id = nid('P');
  db.products.push({
    id, merchantId, zone: 'aesthetics', type: 'sku', name: name || '新作待审',
    cover: '🆕', guide: 1680, member: { l1: 1646, l2: 1596, l3: 1546, l4: 1478 },
    stock: 6, locked: 0, status: '待审', spec: '新品', story: 'P 端提交，待平台审核。', freight: 18, noPoint: false,
  });
  db._idx.product[id] = db.products[db.products.length - 1];
  save();
  return ok('已提交，等待平台审核');
}
