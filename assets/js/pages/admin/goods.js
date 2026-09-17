import { pageCtx } from '../context.js';
import { matchQuery, merchantName, zoneName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageProducts() {
  const { ui, db, C } = pageCtx();
  const tab = ui.tabs.products || 'all';
  let list = db.products.filter((p) => matchQuery(p, ui.q, ['name', 'id']));
  if (tab !== 'all') list = list.filter((p) => p.status === tab);
  return C.DataTablePage({
    title: '商品库',
    desc: '文创多规格 SKU · 书画孤品一码一件 · 售出锁死',
    actions: C.Btn({ label: '待审', go: 'product-audit' }),
    tabs: { key: 'products', current: tab, items: [{ id: 'all', title: '全部' }, { id: '上架', title: '上架' }, { id: '待审', title: '待审' }, { id: '下架', title: '下架' }, { id: '驳回', title: '驳回' }] },
    search: { value: ui.q, placeholder: '商品名' },
    columns: ['商品', '商家', '专区', '类型', '指导价', '库存/锁', '状态', '操作'],
    rows: list.map((p) => C.tr([
      `${p.cover} ${C.escapeHtml(p.name)}`, merchantName(db, p.merchantId), zoneName(p.zone), p.type,
      money(p.guide), `${p.stock} / ${p.locked}`, C.Tag(p.status),
      C.Ops([
        C.Btn({ label: '详情', action: 'open-modal', extra: `data-modal="product" data-id="${p.id}"` }),
        p.status === '上架' ? C.Btn({ label: '下架', action: 'product-off', extra: `data-id="${p.id}"` }) : '',
      ]),
    ])),
  });
}

export function pageProductAudit() {
  const { db, C } = pageCtx();
  const list = db.products.filter((p) => p.status === '待审');
  return C.DataTablePage({
    title: '上下架审核',
    desc: '先审后发，驳回原因回传。',
    columns: ['商品', '商家', '素材', '操作'],
    empty: '暂无待审商品',
    rows: list.map((p) => C.tr([
      `${p.cover} ${C.escapeHtml(p.name)}<div class="muted">${C.escapeHtml(p.story)}</div>`,
      merchantName(db, p.merchantId), '图文/视频/故事 已传',
      C.Ops([
        C.Btn({ label: '通过上架', action: 'product-pass', extra: `data-id="${p.id}"`, primary: true }),
        C.Btn({ label: '驳回', action: 'product-reject', extra: `data-id="${p.id}"` }),
      ]),
    ])),
  });
}

export function pagePrices() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '价格中心',
    desc: '指导价 / 四级会员价 / 活动价，改价留审计',
    columns: ['商品', '指导价', '游历者', '鉴赏者', '知音者', '传承者', '操作'],
    rows: db.products.map((p) => C.tr([
      C.escapeHtml(p.name), money(p.guide), ...['l1', 'l2', 'l3', 'l4'].map((l) => money(p.member[l])),
      C.Btn({ label: '改价', action: 'open-modal', extra: `data-modal="price" data-id="${p.id}"` }),
    ])),
  });
}

export function pageStock() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '库存',
    desc: '下单锁库，超时未付释放。线下展厅可手工调整。',
    columns: ['商品', '在库', '锁定', '可售', '类型', '操作'],
    rows: db.products.map((p) => C.tr([
      C.escapeHtml(p.name), p.stock, p.locked, p.stock - p.locked,
      p.type === 'unique' ? C.Tag('孤品', 'orange') : C.Tag('SKU', 'green'),
      C.Btn({ label: '调整', action: 'open-modal', extra: `data-modal="stock" data-id="${p.id}"` }),
    ])),
  });
}

export function pageCodes() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '一物一码',
    desc: '孤品绑码，售出不可再卖。与甲方存证编号绑定。',
    columns: ['编码', '作品', '状态', '持有人', '存证号', '操作'],
    rows: db.codes.map((c) => C.tr([
      c.id, db.products.find((p) => p.id === c.productId)?.name || '',
      C.Tag(c.status), c.owner || '—', c.trace || '—',
      C.Btn({ label: '查溯源', action: 'trace-lookup', extra: `data-code="${c.id}"` }),
    ])),
  });
}
