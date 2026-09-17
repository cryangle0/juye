import { getDb } from '../lib/store.js';
import { ui } from '../app/state.js';
import { ROLE_ALLOW } from '../data/constants.js';

function badge(list) { return list.length || null; }

export function adminMenus() {
  const d = getDb();
  return [
    { group: '概览', items: [
      { id: 'home', title: '工作台', icon: '⌂' },
      { id: 'dashboard', title: '经营大盘', icon: '▤' },
    ]},
    { group: '一期 · 账号与会员', items: [
      { id: 'merchants', title: '商家入驻', icon: '①', badge: badge(d.merchants.filter((m) => m.status === '待审')) },
      { id: 'roles', title: '角色权限', icon: '⚙' },
      { id: 'members', title: '会员等级', icon: '☺' },
      { id: 'level-config', title: '升降级阈值', icon: '⚙' },
      { id: 'points', title: '双积分', icon: '◎' },
    ]},
    { group: '一期 · 商品订单', items: [
      { id: 'product', title: '商品库', icon: '▣' },
      { id: 'product-audit', title: '上下架审核', icon: '✓', badge: badge(d.products.filter((p) => p.status === '待审')) },
      { id: 'prices', title: '价格中心', icon: '¥' },
      { id: 'stock', title: '库存', icon: '▦' },
      { id: 'codes', title: '一物一码', icon: '#' },
      { id: 'artists', title: '画师档案', icon: '☺' },
      { id: 'media', title: '素材库', icon: '▣' },
      { id: 'orders', title: '订单中心', icon: '▥' },
      { id: 'aftersales', title: '退款退货', icon: '↩', badge: badge(d.aftersales.filter((a) => a.status === '待审' || a.status === '待运营放行')) },
      { id: 'logistics', title: '物流轨迹', icon: '→' },
      { id: 'invoices', title: '发票申请', icon: '▤' },
      { id: 'verify-records', title: '核销记录', icon: '⌁' },
    ]},
    { group: '一期 · 营销财务', items: [
      { id: 'coupons', title: '营销券', icon: '✁' },
      { id: 'newbie', title: '新人礼', icon: '✦' },
      { id: 'redeem', title: '积分兑换物', icon: '◎' },
      { id: 'bills', title: '月对账单', icon: '▣' },
      { id: 'withdraws', title: '分账提现', icon: '¥', badge: badge(d.withdraws.filter((w) => w.status === '待财务审')) },
      { id: 'recon', title: '支付对账', icon: '=', badge: badge(d.recon.filter((r) => r.diff)) },
      { id: 'traces', title: '溯源查询', icon: '◎' },
      { id: 'splits', title: '分账流水', icon: '¥' },
      { id: 'logs', title: '操作日志', icon: '≡' },
    ]},
    { group: '二期 · 预约仪式', items: [
      { id: 'venues', title: '场地预约', icon: '⌂' },
      { id: 'events', title: '活动报名', icon: '★', badge: badge(d.signups.filter((s) => s.status === '候补')) },
      { id: 'messages', title: '消息提醒', icon: '✉' },
      { id: 'ceremonies', title: '仪式定金', icon: '💍' },
      { id: 'customs', title: '定制婚书', icon: '✉' },
    ]},
    { group: '二期 · 政企与内容', items: [
      { id: 'bulk', title: '政企批量', icon: '▣' },
      { id: 'logos', title: 'LOGO 定制', icon: '✎' },
      { id: 'inquiries', title: '大额询价', icon: '?', badge: badge(d.inquiries.filter((i) => i.status === '待审批')) },
      { id: 'enterprises', title: '企业账号', icon: '企' },
      { id: 'claims', title: '对公认领', icon: '¥' },
      { id: 'limited', title: '限量预售', icon: '⏱' },
      { id: 'reviews', title: '评价审核', icon: '✎' },
      { id: 'ugc', title: 'UGC 打卡', icon: '✎' },
      { id: 'invites', title: '好友拉新', icon: '+' },
      { id: 'tags', title: '标签分群', icon: '#' },
    ]},
    { group: '二期 · 排期报表', items: [
      { id: 'resources', title: '资源排期', icon: '▦' },
      { id: 'launches', title: '新品联名', icon: '★' },
      { id: 'exchanges', title: '积分占档', icon: '◎' },
      { id: 'reports-goods', title: '商品分析', icon: '▤' },
      { id: 'reports-member', title: '会员分析', icon: '☺' },
      { id: 'reports-finance', title: '财务报表', icon: '¥' },
      { id: 'audits', title: '审计日志', icon: '≡' },
    ]},
  ];
}

export function merchantMenus() {
  return [
    { group: '经营', items: [
      { id: 'p-home', title: '工作台', icon: '⌂' },
      { id: 'p-products', title: '本店商品', icon: '▣' },
      { id: 'p-orders', title: '本店订单', icon: '▥' },
      { id: 'p-stock', title: '库存', icon: '▦' },
      { id: 'p-cs', title: '客诉', icon: '✉' },
      { id: 'p-bills', title: '分成账单', icon: '¥' },
      { id: 'p-board', title: '经营看板', icon: '▤' },
      { id: 'p-trace', title: '溯源维护', icon: '#' },
    ]},
    { group: '二期', items: [
      { id: 'p-exchange', title: '积分兑排期', icon: '◎' },
      { id: 'p-resource', title: '申请档期', icon: '▦' },
      { id: 'p-launch', title: '新品提报', icon: '★' },
      { id: 'p-event', title: '共创报名', icon: '★' },
      { id: 'p-reviews', title: '评价回复', icon: '✎' },
    ]},
  ];
}

export function enterpriseMenus() {
  return [
    { group: '政企', items: [
      { id: 'e-home', title: '工作台', icon: '⌂' },
      { id: 'e-bulk', title: '批量下单', icon: '▣' },
      { id: 'e-logo', title: 'LOGO 定制', icon: '✎' },
      { id: 'e-inquiry', title: '大额询价', icon: '?' },
      { id: 'e-users', title: '子账号', icon: '☺' },
      { id: 'e-claim', title: '对公进度', icon: '¥' },
      { id: 'e-invoice', title: '专票申请', icon: '▤' },
    ]},
  ];
}

export function storeMenus() {
  return [
    { group: '门店', items: [
      { id: 's-verify', title: '扫码核销', icon: '⌁' },
      { id: 's-shift', title: '交班汇总', icon: '▤' },
      { id: 'verify-records', title: '核销记录', icon: '≡' },
    ]},
  ];
}

export function miniTabs(mode) {
  if (mode === 'verify') {
    return [
      { id: 'mini-verify', title: '核销', icon: 'scan' },
      { id: 'mini-mine', title: '我的', icon: 'mine' },
    ];
  }
  if (mode === 'p') {
    return [
      { id: 'p-home', title: '经营', icon: 'shop' },
      { id: 'p-orders', title: '订单', icon: 'bag' },
      { id: 'p-resource', title: '档期', icon: 'ticket' },
      { id: 'mini-mine', title: '我的', icon: 'mine' },
    ];
  }
  return [
    { id: 'mini-home', title: '首页', icon: 'home' },
    { id: 'mini-zone', title: '专区', icon: 'shop' },
    { id: 'mini-cart', title: '购物车', icon: 'bag' },
    { id: 'mini-wallet', title: '卡包', icon: 'ticket' },
    { id: 'mini-mine', title: '我的', icon: 'mine' },
  ];
}

export function menusFor(mode) {
  if (mode === 'merchant') return merchantMenus();
  if (mode === 'enterprise') return enterpriseMenus();
  if (mode === 'store') return storeMenus();
  const all = adminMenus();
  const allow = ROLE_ALLOW[ui.role];
  if (!allow) return all;
  const set = new Set(allow);
  return all
    .map((g) => ({ ...g, items: g.items.filter((it) => set.has(it.id)) }))
    .filter((g) => g.items.length);
}

export function defaultRoute(mode, role) {
  if (mode === 'admin') {
    if (role === 'finance') return 'dashboard';
    if (role === 'cs') return 'orders';
    return 'home';
  }
  return { merchant: 'p-home', enterprise: 'e-home', store: 's-verify', mini: 'mini-home' }[mode] || 'home';
}
