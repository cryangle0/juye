import { pageCtx } from '../context.js';
import { productName, merchantName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageBulk() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '政企批量下单',
    desc: '标准化节庆套餐、批量数量、分送地址导入。',
    columns: ['单号', '企业', '商品', '数量', '金额', '分送地址', '状态'],
    rows: db.bulkOrders.map((b) => C.tr([
      b.id, db.enterprises.find((e) => e.id === b.ent)?.name, productName(db, b.productId), b.qty, money(b.amount),
      (b.addressList || []).length || b.addresses || 0, C.Tag(b.status),
    ])),
  });
}

export function pageLogos() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '专属 LOGO 定制提报',
    desc: '需求 → 设计确认 → 报价回传 → 交付跟踪',
    columns: ['单号', '企业', '数量', '交期', '报价', '状态', '操作'],
    rows: db.logos.map((l) => C.tr([
      l.id, l.ent, l.qty, l.due, money(l.quote), C.Tag(l.status),
      C.Btn({ label: '下一状态', action: 'logo-next', extra: `data-id="${l.id}"`, primary: true }),
    ])),
  });
}

export function pageInquiries() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '大额询价',
    desc: '阶梯报价、内部审批、有效期；通过转正式订单。',
    columns: ['询价', '标题', '数量', '阶梯价', '有效期', '状态', '操作'],
    rows: db.inquiries.map((i) => C.tr([
      i.id, C.escapeHtml(i.title), i.qty, i.ladders.map((l) => `${l.n}件¥${l.p}`).join('；'), i.valid, C.Tag(i.status),
      i.status === '待审批'
        ? C.Ops([C.Btn({ label: '审批转单', action: 'iq-pass', extra: `data-id="${i.id}"`, primary: true }), C.Btn({ label: '驳回', action: 'iq-reject', extra: `data-id="${i.id}"` })])
        : '—',
    ])),
  });
}

export function pageEnterprises() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '企业账号',
    desc: '主账号 + 子账号隔离；专属价；工单加急。',
    columns: ['企业', '税号', '专属价', '优先客服', '成员'],
    rows: db.enterprises.map((e) => C.tr([
      e.name, e.credit, e.vipPrice ? C.Tag('绿色通道', 'green') : '—', e.priority ? C.Tag('加急', 'orange') : '—',
      db.enterpriseUsers.filter((u) => u.ent === e.id).map((u) => `${u.name}（${u.role}）`).join('、'),
    ])),
    extra: C.Card({
      title: '挂专属价',
      body: `商品 <input class="field-input" id="f-pid" value="P11" style="width:100px;display:inline-block" />
        单价 <input class="field-input" id="f-vip" value="238" style="width:100px;display:inline-block" />
        ${C.Btn({ label: '保存专属价', action: 'hang-vip', primary: true, size: 'sm' })}
        <div class="muted" style="margin-top:8px">当前 P11：¥${db.enterprises[0]?.vipPrices?.P11 || '—'}</div>`,
    }),
  });
}

export function pageClaims() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '对公转账认领',
    desc: '财务匹配金额/附言绑订单。账期授信不做。',
    columns: ['认领', '企业', '金额', '附言', '订单', '状态', '操作'],
    rows: db.claims.map((c) => C.tr([
      c.id, c.ent, money(c.amount), C.escapeHtml(c.memo), c.orderId, C.Tag(c.status),
      c.status === '待认领' ? C.Btn({ label: '认领绑单', action: 'claim', extra: `data-id="${c.id}"`, primary: true }) : '—',
    ])),
  });
}

export function pageLimited() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '限量发售与预售',
    desc: '定时开售、限购、库存锁。与一期锁库同一套。',
    columns: ['商品', '开售', '限购', '预售定金', '库存', '操作'],
    rows: db.products.filter((p) => p.limited).map((p) => C.tr([
      p.name, p.saleAt, `${p.limitPer} 件/人`, p.presale ? money(p.deposit) : '全款', p.stock,
      C.Ops([
        C.Btn({ label: '开售已到点', action: 'sale-now', extra: `data-id="${p.id}"` }),
        C.Btn({ label: '推迟开售', action: 'sale-later', extra: `data-id="${p.id}"` }),
      ]),
    ])),
    hint: { kind: 'info', text: 'C 端未到点下单会被拦截；到点后超限购同样拦截。' },
  });
}

export function pageResources() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '直播 / 大屏 / 展位排期', desc: '只做排期与审批，不含直播中台。冲突检测。' })
    + C.Card({
      body: C.Table({
        columns: ['资源', '日期', '时段', '占用商家', '状态'],
        rows: db.resources.map((r) => C.tr([r.kind, r.date, r.time, r.merchantId ? merchantName(db, r.merchantId) : '—', C.Tag(r.status)])),
      }),
    })
    + C.Card({
      body: C.Table({
        columns: ['申请', '商家', '资源', '状态', '操作'],
        rows: db.resourceApps.map((a) => C.tr([
          a.id, merchantName(db, a.merchantId), db.resources.find((r) => r.id === a.resourceId)?.kind, C.Tag(a.status),
          a.status === '待审'
            ? C.Ops([C.Btn({ label: '通过占用', action: 'res-pass', extra: `data-id="${a.id}"`, primary: true }), C.Btn({ label: '驳回', action: 'res-reject', extra: `data-id="${a.id}"` })])
            : '—',
        ])),
      }),
    })
    + C.Alert({ kind: 'warn', text: '走查：牡丹笺社再申请「裸眼大屏 9/24 18:00」应冲突驳回。' });
}

export function pageLaunches() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '新品首发 / 联名共创',
    desc: '线上提报、平台审批、状态留痕。',
    columns: ['提报', '商家', '标题', '状态', '操作'],
    rows: db.launches.map((l) => C.tr([
      l.id, merchantName(db, l.merchantId), C.escapeHtml(l.title), C.Tag(l.status),
      l.status === '待审'
        ? C.Ops([C.Btn({ label: '通过', action: 'ln-pass', extra: `data-id="${l.id}"`, primary: true }), C.Btn({ label: '驳回', action: 'ln-reject', extra: `data-id="${l.id}"` })])
        : '—',
    ])),
  });
}

export function pageExchanges() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '产业积分兑换排期',
    desc: '兑换展位/大屏/直播时段后自动占档，冲突则失败且不扣分。',
    columns: ['兑换单', '商家', '资源', '积分', '状态'],
    rows: db.exchanges.map((e) => C.tr([e.id, merchantName(db, e.merchantId), e.item, e.cost, C.Tag(e.status)])),
  });
}
