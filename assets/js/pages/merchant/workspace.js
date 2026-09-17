import { pageCtx } from '../context.js';
import { memberName, productName, merchantName } from '../../lib/names.js';
import { money } from '../../lib/format.js';
import { ui } from '../../app/state.js';

const mid = () => ui.merchantId;

export function pagePHome() {
  const { db, C } = pageCtx();
  const orders = db.orders.filter((o) => o.merchantId === mid());
  const mine = db.products.filter((p) => p.merchantId === mid());
  return C.PageHeader({ title: '商家工作台', desc: merchantName(db, mid()) + ' · 仅本店数据' })
    + C.MetricGrid([
      C.Metric({ label: '本店订单', value: orders.length, go: 'p-orders', tone: 'po' }),
      C.Metric({ label: '待发货', value: orders.filter((o) => o.status === '待发货').length, go: 'p-orders', tone: 'pending' }),
      C.Metric({ label: '产业积分', value: db.merchants.find((m) => m.id === mid())?.pPoints || 0, go: 'p-exchange', tone: 'range' }),
      C.Metric({ label: '在售', value: mine.filter((p) => p.status === '上架').length, go: 'p-products' }),
    ]);
}

export function pagePProducts() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '本店商品',
    desc: '提交后需平台审核',
    actions: C.Btn({ label: '提交新品', action: 'p-new-product', primary: true }),
    columns: ['商品', '专区', '库存', '状态'],
    rows: db.products.filter((p) => p.merchantId === mid()).map((p) => C.tr([p.name, p.zone, p.stock, C.Tag(p.status)])),
  });
}

export function pagePOrders() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '本店订单',
    desc: '看不到他店',
    columns: ['单号', '会员', '金额', '状态', '操作'],
    rows: db.orders.filter((o) => o.merchantId === mid()).map((o) => C.tr([
      o.id, memberName(db, o.userId), money(o.amount), C.Tag(o.status),
      o.status === '待发货'
        ? C.Btn({ label: '发货', action: 'ship', extra: `data-id="${o.id}"`, primary: true })
        : C.Btn({ label: '详情', action: 'open-modal', extra: `data-modal="order" data-id="${o.id}"` }),
    ])),
  });
}

export function pagePStock() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '本店库存', columns: ['商品', '库存', '锁'],
    rows: db.products.filter((p) => p.merchantId === mid()).map((p) => C.tr([p.name, p.stock, p.locked])),
  });
}

export function pagePCs() {
  const { db, C } = pageCtx();
  const as = db.aftersales.filter((a) => db.orders.find((o) => o.id === a.orderId)?.merchantId === mid());
  return C.DataTablePage({
    title: '客诉', desc: '超时升级平台', columns: ['工单', '订单', '状态'],
    empty: '暂无客诉',
    rows: as.map((a) => C.tr([a.id, a.orderId, C.Tag(a.status)])),
  });
}

export function pagePBills() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '分成对账单', columns: ['账单', 'GMV', '分成', '状态'],
    rows: db.bills.filter((b) => b.merchantId === mid()).map((b) => C.tr([b.id, money(b.gmv), money(b.share), C.Tag(b.status)])),
  });
}

export function pagePTrace() {
  const { db, C } = pageCtx();
  const codes = db.codes.filter((c) => db.products.find((p) => p.id === c.productId)?.merchantId === mid());
  return C.PageHeader({ title: '溯源信息维护', desc: '填写作品编码与存证编号，C 端扫码查甲方。', actions: C.Btn({ label: '保存', action: 'save-trace', primary: true }) })
    + C.Card({
      body: C.Table({
        columns: ['编码', '作品', '存证'],
        rows: codes.map((c) => C.tr([c.id, productName(db, c.productId), `<input class="field-input" id="tr-${c.id}" value="${C.escapeHtml(c.trace)}" />`])),
      }),
    });
}

export function pagePBoard() {
  const { db, C } = pageCtx();
  const os = db.orders.filter((o) => o.merchantId === mid());
  return C.PageHeader({ title: '经营看板', desc: '口径与平台一致，不做自助数仓' })
    + C.MetricGrid([
      C.Metric({ label: '销售额', value: money(os.reduce((s, o) => s + o.amount, 0)) }),
      C.Metric({ label: '订单数', value: os.length }),
      C.Metric({ label: '产业积分', value: db.merchants.find((m) => m.id === mid()).pPoints }),
    ]);
}

export function pagePExchange() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '积分兑换排期', desc: '兑展位/大屏/直播时段，冲突失败不扣分。' })
    + C.Card({ body: `当前产业积分 <strong>${db.merchants.find((m) => m.id === mid()).pPoints}</strong>` })
    + C.Card({
      body: C.Table({
        columns: ['资源', '时段', '状态', '操作'],
        rows: db.resources.map((r) => C.tr([
          r.kind, `${r.date} ${r.time}`, C.Tag(r.status),
          C.Btn({ label: '2000 积分兑换', action: 'p-ex', extra: `data-id="${r.id}"`, primary: true }),
        ])),
      }),
    });
}

export function pagePResource() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '申请直播/大屏档期',
    desc: '冲突检测、平台审批。不含播流。',
    columns: ['资源', '状态', '操作'],
    rows: db.resources.map((r) => C.tr([
      `${r.kind} ${r.date} ${r.time}`, C.Tag(r.status),
      C.Btn({ label: '申请此时段', action: 'p-res', extra: `data-id="${r.id}"`, primary: true }),
    ])),
  });
}

export function pagePLaunch() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '新品/联名提报',
    actions: C.Btn({ label: '提交联名方案', action: 'p-launch', primary: true }),
    columns: ['标题', '状态'],
    rows: db.launches.filter((l) => l.merchantId === mid()).map((l) => C.tr([C.escapeHtml(l.title), C.Tag(l.status)])),
  });
}

export function pagePReviews() {
  const { db, C } = pageCtx();
  const list = db.reviews.filter((r) => db.products.find((p) => p.id === r.productId)?.merchantId === mid());
  return C.DataTablePage({
    title: '评价回复',
    columns: ['商品', '内容', '回复', '操作'],
    rows: list.map((r) => C.tr([
      productName(db, r.productId), C.escapeHtml(r.text), C.escapeHtml(r.reply || '—'),
      C.Btn({ label: '回复', action: 'p-reply', extra: `data-id="${r.id}"` }),
    ])),
  });
}
