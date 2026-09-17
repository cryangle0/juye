import { pageCtx } from '../context.js';
import { productName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageEHome() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '政企定制中心', desc: '巨野文旅集团 · 子账号只能看本企业单据' })
    + C.MetricGrid([
      C.Metric({ label: '批量单', value: db.bulkOrders.length, go: 'e-bulk' }),
      C.Metric({ label: '询价', value: db.inquiries.length, go: 'e-inquiry' }),
      C.Metric({ label: 'LOGO 定制', value: db.logos.length, go: 'e-logo' }),
    ]);
}

export function pageEBulk() {
  const { db, C } = pageCtx();
  const current = db.bulkOrders[0];
  return C.DataTablePage({
    title: '节庆伴手礼批量',
    desc: '走专属价；每行一个分送地址。开票走专票申请。',
    actions: C.Btn({ label: '再下一单（专属价）', action: 'e-bulk-new', primary: true }),
    columns: ['单号', '商品', '数量', '金额', '地址数', '状态'],
    rows: db.bulkOrders.map((b) => C.tr([b.id, productName(db, b.productId), b.qty, money(b.amount), b.addresses || (b.addressList || []).length, C.Tag(b.status)])),
    extra: current ? C.Card({
      title: '分送地址导入 · ' + current.id,
      body: `<textarea class="field-input" id="f-addr" rows="4">${C.escapeHtml((current.addressList || []).join('\n'))}</textarea>`
        + C.Btn({ label: '导入地址', action: 'import-addr', extra: `data-id="${current.id}"`, primary: true, size: 'sm' }),
    }) : '',
  });
}

export function pageELogo() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: 'LOGO 定制提报',
    actions: C.Btn({ label: '新提报', action: 'e-logo-new', primary: true }),
    columns: ['单号', '数量', '交期', '状态'],
    rows: db.logos.map((l) => C.tr([l.id, l.qty, l.due, C.Tag(l.status)])),
  });
}

export function pageEInquiry() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '大额询价',
    actions: C.Btn({ label: '提交询价', action: 'e-iq-new', primary: true }),
    columns: ['询价', '标题', '数量', '状态'],
    rows: db.inquiries.map((i) => C.tr([i.id, C.escapeHtml(i.title), i.qty, C.Tag(i.status)])),
  });
}

export function pageEUsers() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '企业子账号', desc: '权限隔离',
    columns: ['账号', '角色'],
    rows: db.enterpriseUsers.map((u) => C.tr([u.name, u.role])),
  });
}

export function pageEClaim() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '对公打款进度',
    columns: ['金额', '附言', '状态'],
    rows: db.claims.map((c) => C.tr([money(c.amount), C.escapeHtml(c.memo), C.Tag(c.status)])),
  });
}

export function pageEInvoice() {
  const { db, C } = pageCtx();
  const e = db.enterprises.find((x) => x.id === 'E1') || db.enterprises[0];
  const mine = db.invoices.filter((i) => i.kind === '专票' || i.title === e?.name);
  return C.PageHeader({ title: '增值税专票申请', desc: '信息登记，开具仍财务回填，不接税控。' })
    + C.Card({
      body: C.Kv([['抬头', e?.name], ['税号', e?.credit]])
        + C.Field({ label: '关联订单', inner: C.Input({ id: 'f-oid', value: db.bulkOrders[0]?.id || '' }) })
        + C.Btn({ label: '提交专票申请', action: 'e-vat', primary: true, size: '' }),
    })
    + C.Card({
      title: '申请记录',
      body: C.Table({
        columns: ['申请', '订单', '状态', '票号'],
        rows: mine.map((i) => C.tr([i.id, i.orderId || '—', C.Tag(i.status), i.no || '待回填'])),
      }),
    });
}
