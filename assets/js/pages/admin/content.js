import { LEVELS, ZONES } from '../../data/constants.js';
import { pageCtx } from '../context.js';
import { memberName, productName, merchantName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageReviews() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '商品评价',
    desc: '图文评价、评分、画师回复；先审后发。',
    columns: ['商品', '会员', '评分', '内容', '回复', '状态', '操作'],
    rows: db.reviews.map((r) => C.tr([
      productName(db, r.productId), memberName(db, r.userId), r.score, C.escapeHtml(r.text), C.escapeHtml(r.reply || '—'), C.Tag(r.status),
      r.status === '待审'
        ? C.Ops([C.Btn({ label: '过审', action: 'rv-pass', extra: `data-id="${r.id}"`, primary: true }), C.Btn({ label: '驳回', action: 'rv-reject', extra: `data-id="${r.id}"` })])
        : '—',
    ])),
  });
}

export function pageUgc() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: 'UGC 打卡积分',
    desc: '审核通过发 C 积分；同一活动去重防刷。',
    columns: ['用户', '活动', '内容', '拟发分', '状态', '操作'],
    rows: db.ugc.map((u) => C.tr([
      memberName(db, u.userId), u.event, C.escapeHtml(u.text), u.points, C.Tag(u.status),
      u.status === '待审'
        ? C.Ops([C.Btn({ label: '过审发分', action: 'ugc-pass', extra: `data-id="${u.id}"`, primary: true }), C.Btn({ label: '驳回', action: 'ugc-reject', extra: `data-id="${u.id}"` })])
        : '—',
    ])),
  });
}

export function pageInvites() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '好友拉新',
    desc: '仅一层：邀请人 ← 被邀请人。不做多级分销。',
    columns: ['邀请人', '被邀请人', '状态', '积分'],
    rows: db.invites.map((i) => C.tr([memberName(db, i.from), memberName(db, i.to), C.Tag(i.status), i.points])),
  });
}

export function pageTags() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '标签与分群', desc: '自动标签可配规则。分群导出供发券。不做完整 CDP。', actions: C.Btn({ label: '给研学分群发券', action: 'seg-coupon', primary: true }) })
    + `<div class="split-grid">${C.Card({ body: C.Table({ columns: ['规则', '条件', '自动'], rows: db.tagRules.map((t) => C.tr([t.name, t.when, t.auto ? '是' : '否'])) }) })}
      ${C.Card({ body: C.Table({ columns: ['分群', '人数', '标签'], rows: db.segments.map((s) => C.tr([s.name, s.count, s.tags.join('、')])) }) })}</div>`;
}

export function pageReportsGoods() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '商品 / 专区 / 画师分析',
    desc: '销量、周转、滞销、画师贡献度，按日导出。',
    actions: C.Btn({ label: '导出 CSV', action: 'toast', extra: 'data-msg="已导出商品分析（演示）"', primary: true }),
    columns: ['专区', '在售', '相关订单', '滞销预警'],
    rows: ZONES.map((z) => C.tr([
      z.name,
      db.products.filter((p) => p.zone === z.id && p.status === '上架').length,
      db.orders.filter((o) => o.items.some((i) => db.products.find((p) => p.id === i.productId)?.zone === z.id)).length + ' 单',
      db.products.filter((p) => p.zone === z.id && p.stock > 50).length ? C.Tag('有', 'orange') : C.Tag('无', 'green'),
    ])),
  });
}

export function pageReportsMember() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '会员积分分析', desc: '等级分布、发放/消耗/沉淀' })
    + C.MetricGrid(LEVELS.map((l) => C.Metric({ label: l.name, value: db.members.filter((m) => m.level === l.id).length })))
    + C.Card({
      body: C.Table({
        columns: ['类型', '笔数', '积分合计'],
        rows: ['获取', '消耗', '退返'].map((t) => C.tr([
          t, db.pointsC.filter((p) => p.type === t).length,
          db.pointsC.filter((p) => p.type === t).reduce((s, p) => s + p.delta, 0),
        ])),
      }),
    });
}

export function pageReportsFinance() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '财务报表',
    desc: '收入、分成、佣金、退款、对账差异。口径与一期账单一致。',
    columns: ['月份', '商家', 'GMV', '分成', '平台佣金'],
    rows: db.bills.map((b) => C.tr([b.month, merchantName(db, b.merchantId), money(b.gmv), money(b.share), money(b.platform)])),
  });
}
