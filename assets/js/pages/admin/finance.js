import { pageCtx } from '../context.js';
import { memberName, merchantName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageCoupons() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '优惠券 / 满减 / 会员日', desc: '叠加：会员价 → 券 → 积分 → 运费。券与满减二选一。', actions: C.Btn({ label: '发放满减券', action: 'grant-full', primary: true }) })
    + C.Alert({ kind: 'info', text: `会员日至 ${db.memberDay.until}，额外 ${db.memberDay.extraOff * 100}% ${db.memberDay.on ? '进行中' : '已关闭'}。 ${C.Btn({ label: db.memberDay.on ? '关闭会员日' : '开启会员日', action: 'toggle-memberday' })}` })
    + C.Card({ title: '模板', body: C.Table({ columns: ['模板', '场景', '面额', '门槛', '状态'], rows: db.couponTpls.map((t) => C.tr([t.name, t.scene, t.value, t.min, C.Tag(t.status)])) }) })
    + C.Card({ title: '已发券', body: C.Table({ columns: ['券', '用户', '状态', '门槛'], rows: db.coupons.map((c) => C.tr([c.name, memberName(db, c.user) || '可领', C.Tag(c.status), c.min])) }) });
}

export function pageNewbie() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '新人礼包', desc: '新注册或首次下单自动发券，同一用户一次。', actions: C.Btn({ label: '给游历者补发', action: 'grant-new', primary: true }) })
    + C.Card({ body: `规则：满 99-20 · 防重复。已发 ${db.coupons.filter((c) => c.name.includes('新人')).length} 张。` });
}

export function pageBills() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: 'P 端月度对账单',
    desc: '按产业会员档位核算货款分成，可申诉备注。',
    columns: ['账单', '商家', '月份', 'GMV', '商家分成', '平台', '状态', '操作'],
    rows: db.bills.map((b) => C.tr([
      b.id, merchantName(db, b.merchantId), b.month, money(b.gmv), money(b.share), money(b.platform), C.Tag(b.status),
      C.Ops([C.Btn({ label: '下载', action: 'toast', extra: 'data-msg="已生成对账单 CSV（演示）"' }), C.Btn({ label: '申诉', action: 'bill-appeal', extra: `data-id="${b.id}"` })]),
    ])),
  });
}

export function pageWithdraws() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '分账与提现',
    desc: '成交后调甲方清分接口。不做自建二清钱包。',
    columns: ['单号', '商家', '金额', '状态', '时间', '操作'],
    rows: db.withdraws.map((w) => C.tr([
      w.id, merchantName(db, w.merchantId), money(w.amount), C.Tag(w.status), w.at,
      w.status === '待财务审'
        ? C.Ops([C.Btn({ label: '审批打款', action: 'wd-pass', extra: `data-id="${w.id}"`, primary: true }), C.Btn({ label: '驳回', action: 'wd-reject', extra: `data-id="${w.id}"` })])
        : '—',
    ])),
  });
}

export function pageRecon() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '支付对账',
    desc: '按日核对支付渠道与订单差异告警。',
    columns: ['日期', '渠道', '订单', '差异', '状态'],
    rows: db.recon.map((r) => C.tr([r.date, money(r.channel), money(r.orders), money(r.diff), C.Tag(r.status)])),
  });
}

export function pageDashboard() {
  const { db, C } = pageCtx();
  const gmv = db.orders.filter((o) => o.status !== '已取消' && o.status !== '待支付').reduce((s, o) => s + o.amount, 0);
  return C.PageHeader({ title: '经营大盘', desc: 'GMV / 订单量 / 客单价 / 会员数 · T+1' })
    + C.MetricGrid([
      C.Metric({ label: 'GMV', value: money(gmv), go: 'orders', tone: 'po' }),
      C.Metric({ label: '订单', value: db.orders.length, go: 'orders', tone: 'range' }),
      C.Metric({ label: '会员', value: db.members.length, go: 'members', tone: 'info' }),
      C.Metric({ label: '在售 SKU', value: db.products.filter((p) => p.status === '上架').length, go: 'product', tone: 'stock' }),
    ])
    + C.Alert({ kind: 'info', text: '不做毫秒级实时中台。对公打款认领见「对公认领」。' });
}

export function pageTraces() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '溯源查询', desc: '扫码/输码调甲方存证接口。不开发区块链。' })
    + `<div class="page-card search-panel"><input class="field-input" id="f-code" placeholder="作品编码 如 LY-2026-0007" />${C.Btn({ label: '查询甲方存证', action: 'trace-q', primary: true })}</div>`
    + C.Card({
      body: C.Table({
        columns: ['编码', '作品', '作者', '年份', '存证', '结果'],
        rows: db.traces.map((t) => C.tr([t.code, t.title, t.artist, t.year, t.chain, C.Tag(t.result, 'green')])),
      }),
    });
}

export function pageLogs() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '操作日志 / 审计',
    desc: '入驻审核、改价、退款、分账、预约改档、对公认领只追加不可改。',
    columns: ['时间', '分类', '操作人', '内容'],
    rows: db.audits.map((a) => C.tr([a.at, C.Tag(a.cat, 'blue'), a.who, C.escapeHtml(a.action)])),
  });
}
