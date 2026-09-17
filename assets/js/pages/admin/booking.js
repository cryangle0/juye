import { pageCtx } from '../context.js';
import { memberName, levelName } from '../../lib/names.js';

export function pageVenues() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '场地时段预约', desc: '冲突时段不可重复占用；改约/取消释放名额；成功生成到店凭证' })
    + C.Alert({ kind: 'info', text: `代客预约人数 <input class="field-input" id="f-people" value="2" style="width:72px;display:inline-block" /> 人` })
    + C.Card({ title: '场地', body: C.Table({ columns: ['场地', '容量'], rows: db.venues.map((v) => C.tr([v.name, v.cap])) }) })
    + C.Card({
      title: '时段占用',
      body: C.Table({
        columns: ['场地', '日期', '时段', '已用/容量', '操作'],
        rows: db.slots.map((s) => {
          const v = db.venues.find((x) => x.id === s.venueId);
          const full = s.used >= s.cap;
          return C.tr([
            v.name, s.date, s.time, `${s.used}/${s.cap} ${full ? C.Tag('已满') : C.Tag('可约')}`,
            C.Ops([
              C.Btn({ label: full ? '演示撞档' : '代客预约', action: 'book-slot', extra: `data-id="${s.id}"`, primary: !full }),
            ]),
          ]);
        }),
      }),
    })
    + C.Card({
      title: '预约单',
      body: C.Table({
        columns: ['单号', '会员', '时段', '人数', '凭证', '状态', '操作'],
        rows: db.bookings.map((b) => {
          const s = db.slots.find((x) => x.id === b.slotId);
          return C.tr([
            b.id, memberName(db, b.userId), `${s?.date} ${s?.time}`, b.people, b.verifyCode, C.Tag(b.status),
            b.status === '成功'
              ? C.Ops([C.Btn({ label: '改约', action: 'change-book', extra: `data-id="${b.id}"` }), C.Btn({ label: '取消释放', action: 'cancel-book', extra: `data-id="${b.id}"` })])
              : '—',
          ]);
        }),
      }),
    });
}

export function pageEvents() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: '活动报名', desc: '名额上限、候补队列、取消后自动补给、签到码现场核销' })
    + C.Card({
      body: C.Table({
        columns: ['活动', '时间', '名额', '候补', '门槛', '操作'],
        rows: db.events.map((e) => C.tr([
          `${C.escapeHtml(e.name)}${e.mix ? C.Tag('P/C混合', 'blue') : ''}`, e.date, `${e.used}/${e.cap}`, e.wait, levelName(e.need),
          C.Ops([
            C.Btn({ label: '代客报名', action: 'signup', extra: `data-id="${e.id}"`, primary: true }),
            e.mix ? C.Btn({ label: '导出名单', action: 'export-sign', extra: `data-id="${e.id}"` }) : '',
          ]),
        ])),
      }),
    })
    + C.Card({
      body: C.Table({
        columns: ['报名', '活动', '会员', '状态', '签到码', '操作'],
        rows: db.signups.map((s) => C.tr([
          s.id, db.events.find((e) => e.id === s.eventId)?.name, memberName(db, s.userId),
          C.Tag(s.status) + (s.queue ? ' #' + s.queue : ''), s.code || '—',
          ['成功', '候补'].includes(s.status)
            ? C.Ops([
              C.Btn({ label: '取消（测递补）', action: 'cancel-sign', extra: `data-id="${s.id}"` }),
              C.Btn({ label: '改签见面会', action: 'change-sign', extra: `data-id="${s.id}" data-event="EV2"` }),
            ]) : '—',
        ])),
      }),
    })
    + C.Alert({ kind: 'warn', text: '走查：取消一条「九月夜场」成功报名，候补第一人会自动转正并出签到码。' });
}

export function pageMessages() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '预约报名提醒',
    desc: '成功 / 开场前 / 候补转正 / 取消 · 站内信 + 微信模板（甲方）',
    actions: C.Btn({ label: '补发开场提醒', action: 'remind', primary: true }),
    columns: ['时间', '会员', '标题', '内容'],
    rows: db.messages.map((m) => C.tr([m.at, memberName(db, m.to), m.title, C.escapeHtml(m.body)])),
  });
}

export function pageCeremonies() {
  const { db, C } = pageCtx();
  const { money } = C;
  return C.PageHeader({ title: '国风仪式套餐', desc: '线上不做档期查询。留电话/线下联系。定金走微信。' })
    + C.Card({ body: C.Kv([['预约电话', '0530-8886688'], ['定金规则', db.config.depositRefundable ? '可退（后台可配）' : '不可退']]) })
    + C.Card({
      body: C.Table({
        columns: ['单号', '会员', '套餐', '定金', '尾款', '状态', '操作'],
        rows: db.ceremonies.map((c) => C.tr([
          c.id, memberName(db, c.userId), db.products.find((p) => p.id === c.productId)?.name,
          `${money(c.paidDeposit)}/${money(c.deposit)}`, `${money(c.paidBalance)}/${money(c.balance)}`, C.Tag(c.status),
          C.Ops([
            c.status === '已收定金' ? C.Btn({ label: '收尾款', action: 'pay-balance', extra: `data-id="${c.id}"`, primary: true }) : '',
            c.status === '尾款已付' ? C.Btn({ label: '现场交付', action: 'deliver-cm', extra: `data-id="${c.id}"` }) : '',
            c.status === '已收定金' ? C.Btn({ label: '退定金', action: 'refund-deposit', extra: `data-id="${c.id}"` }) : '',
          ]),
        ])),
      }),
    });
}

export function pageCustoms() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '定制婚书 / 礼盒',
    desc: '款式、文案、材质进系统，生成定制订单。',
    columns: ['单号', '会员', '款式', '文案', '材质', '状态', '操作'],
    rows: db.customs.map((c) => C.tr([
      c.id, memberName(db, c.userId), c.style, C.escapeHtml(c.text), c.material, C.Tag(c.status),
      c.status !== '已交付' ? C.Btn({ label: '推进制作', action: 'custom-next', extra: `data-id="${c.id}"`, primary: true }) : '—',
    ])),
  });
}
