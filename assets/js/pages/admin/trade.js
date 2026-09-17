import { pageCtx } from '../context.js';
import { matchQuery, merchantName, memberName, productName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageOrders() {
  const { ui, db, C } = pageCtx();
  const tab = ui.tabs.orders || 'all';
  let list = db.orders.filter((o) => matchQuery(o, ui.q, ['id', 'userId']));
  if (tab !== 'all') list = list.filter((o) => o.status === tab);
  return C.DataTablePage({
    title: '订单中心',
    desc: '购物单 / 核销单 / 卡券单统一。定制单走二期流程。',
    tabs: {
      key: 'orders', current: tab,
      items: ['all', '待支付', '待发货', '待核销', '售后中', '已完成'].map((id) => ({ id, title: id === 'all' ? '全部' : id })),
    },
    search: { value: ui.q, placeholder: '单号' },
    columns: ['单号', '会员', '商家', '类型', '实付', '履约', '状态', '操作'],
    rows: list.map((o) => C.tr([
      o.id, memberName(db, o.userId), merchantName(db, o.merchantId), o.type,
      money(o.amount + (o.freight || 0) - (o.coupon || 0) - (o.points || 0)),
      `${o.fulfill}${o.verifyCode ? `<div class="muted">${o.verifyCode}</div>` : ''}${o.express ? `<div class="muted">${o.express}</div>` : ''}`,
      C.Tag(o.status),
      C.Ops([
        C.Btn({ label: '详情', action: 'open-modal', extra: `data-modal="order" data-id="${o.id}"` }),
        o.status === '待发货' ? C.Btn({ label: '发货', action: 'ship', extra: `data-id="${o.id}"`, primary: true }) : '',
        o.status === '已发货' ? C.Btn({ label: '签收', action: 'complete', extra: `data-id="${o.id}"` }) : '',
      ]),
    ])),
  });
}

export function pageAftersales() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '退款退货',
    desc: '优惠分摊后退款；积分/券按规则退回。原作默认不退，运营可放行。',
    columns: ['工单', '订单', '类型', '金额', '状态', '原因', '操作'],
    rows: db.aftersales.map((a) => C.tr([
      a.id, a.orderId, a.type, money(a.amount),
      C.Tag(a.status) + (a.artOverride ? C.Tag('原作', 'orange') : ''),
      C.escapeHtml(a.reason),
      ['待审', '待运营放行'].includes(a.status)
        ? C.Ops([
          C.Btn({ label: '同意退款', action: 'as-pass', extra: `data-id="${a.id}"`, primary: true }),
          C.Btn({ label: '驳回', action: 'as-reject', extra: `data-id="${a.id}"` }),
        ]) : '—',
    ])),
  });
}

export function pageLogistics() {
  const { db, C } = pageCtx();
  const list = db.orders.filter((o) => o.express);
  return C.DataTablePage({
    title: '物流轨迹',
    desc: '电子面单 + 轨迹。高价值件保价登记。',
    columns: ['订单', '运单', '轨迹', '保价'],
    empty: '暂无在途包裹',
    rows: list.map((o) => C.tr([o.id, o.express, (o.trace || []).join(' → '), o.amount > 10000 ? '已登记 ' + money(o.amount) : '—'])),
  });
}

export function pageInvoices() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '发票申请',
    desc: '个人/企业信息登记，财务开具后回填。不接税控。',
    columns: ['申请', '类型', '抬头', '税号', '状态', '票号', '操作'],
    rows: db.invoices.map((i) => C.tr([
      i.id, i.kind, C.escapeHtml(i.title), i.tax || '—', C.Tag(i.status), i.no || '—',
      i.status !== '已回填' ? C.Btn({ label: '回填票号', action: 'invoice-fill', extra: `data-id="${i.id}"`, primary: true }) : '—',
    ])),
  });
}

export function pageVerifyRecords() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '门店核销记录',
    desc: '重复码拒绝。PC 可补核销。',
    actions: C.Btn({ label: '补核销', action: 'open-modal', extra: 'data-modal="verify"', primary: true }),
    columns: ['时间', '码', '单据', '会员', '操作人', '状态'],
    rows: db.verifies.map((v) => C.tr([v.at, v.code, v.orderId, v.user || '—', v.by, C.Tag(v.status)])),
  });
}
