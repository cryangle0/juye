import { LEVELS } from '../../data/constants.js';
import { pageCtx } from '../context.js';
import { matchQuery, merchantName, memberName, levelName, zoneName } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageMerchants() {
  const { ui, db, C } = pageCtx();
  const tab = ui.tabs.merchants || 'all';
  let list = db.merchants.filter((m) => matchQuery(m, ui.q, ['name', 'contact', 'status']));
  if (tab !== 'all') list = list.filter((m) => m.status === tab);
  return C.DataTablePage({
    title: '商家入驻',
    desc: '执照 / 身份证明 / 权属 · 通过开通后台，驳回回传原因',
    tabs: {
      key: 'merchants', current: tab,
      items: [
        { id: 'all', title: '全部' },
        { id: '待审', title: '待审', badge: db.merchants.filter((m) => m.status === '待审').length },
        { id: '通过', title: '已通过' },
        { id: '驳回', title: '驳回' },
      ],
    },
    search: { value: ui.q, placeholder: '商家 / 联系人' },
    columns: ['商家', '联系人', '档位', '资质', '状态', '操作'],
    rows: list.map((m) => C.tr([
      C.escapeHtml(m.name),
      `${C.escapeHtml(m.contact)} ${C.escapeHtml(m.phone)}`,
      C.escapeHtml(db.tiers.find((t) => t.id === m.tier)?.name || m.tier),
      `执照${C.escapeHtml(m.license)} · 权属${C.escapeHtml(m.copyright)}`,
      C.Tag(m.status) + (m.reason ? `<div class="muted">${C.escapeHtml(m.reason)}</div>` : ''),
      C.Ops([
        C.Btn({ label: '详情', action: 'open-modal', extra: `data-modal="merchant" data-id="${m.id}"` }),
        m.status === '待审' ? C.Btn({ label: '通过', action: 'merchant-pass', extra: `data-id="${m.id}"`, primary: true }) : '',
        m.status === '待审' ? C.Btn({ label: '驳回', action: 'merchant-reject', extra: `data-id="${m.id}"` }) : '',
      ]),
    ])),
  });
}

export function pageRoles() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '角色权限',
    desc: '固定角色包，不做可视化权限设计器。商家数据按店铺隔离。',
    columns: ['角色', '数据范围'],
    rows: db.roles.map((r) => C.tr([C.escapeHtml(r.name), C.escapeHtml(r.menus)])),
    hint: { kind: 'info', text: '顶栏可切换超管 / 运营 / 财务 / 客服。商家与政企走独立登录。' },
  });
}

export function pageMembers() {
  const { ui, db, C } = pageCtx();
  return C.PageHeader({ title: '会员等级', desc: '成长值升级 · 保级周期可配', actions: C.Btn({ label: '阈值配置', go: 'level-config' }) })
    + C.MetricGrid(LEVELS.map((l) => C.Metric({ label: `${l.name} · ${l.alias}`, value: db.members.filter((m) => m.level === l.id).length, tone: 'range' })))
    + C.Card({
      body: C.Table({
        columns: ['会员', '手机', '等级', '累计消费', 'C积分', '标签', '操作'],
        rows: db.members.filter((m) => matchQuery(m, ui.q, ['name', 'phone'])).map((m) => C.tr([
          C.escapeHtml(m.name), m.phone, C.Tag(levelName(m.level), 'green'),
          money(m.spend), m.cPoints, (m.tags || []).map((t) => C.Tag(t, 'blue')).join(' '),
          C.Ops([
            C.Btn({ label: '流水', action: 'open-modal', extra: `data-modal="member" data-id="${m.id}"` }),
            C.Btn({ label: '生日礼', action: 'grant-birthday', extra: `data-id="${m.id}"` }),
          ]),
        ])),
      }),
    });
}

export function pageLevelConfig() {
  const { C } = pageCtx();
  return C.PageHeader({ title: '升降级阈值', desc: '上线前甲方书面确认', actions: C.Btn({ label: '保存', action: 'save-levels', primary: true }) })
    + C.Card({
      body: C.Table({
        columns: ['等级', '升级门槛', '保级消费', '折扣', '专区'],
        rows: LEVELS.map((l) => C.tr([
          l.name,
          `<input class="field-input" id="th-${l.id}" value="${l.threshold}" />`,
          `<input class="field-input" id="kp-${l.id}" value="${l.keep}" />`,
          Math.round(l.discount * 100) + '%',
          l.zones.map(zoneName).join('、'),
        ])),
      }),
    });
}

export function pagePoints() {
  const { ui, db, C } = pageCtx();
  const tab = ui.tabs.points || 'c';
  const rows = tab === 'p'
    ? db.pointsP.map((x) => C.tr([x.at, merchantName(db, x.merchantId), x.type, x.delta, x.orderId || '—', C.escapeHtml(x.note)]))
    : db.pointsC.map((x) => C.tr([x.at, memberName(db, x.userId), x.type, x.delta, x.orderId || '—', C.escapeHtml(x.note)]));
  return C.DataTablePage({
    title: '双积分账本',
    desc: 'C / P 分账本，禁止混清算。互通按可配汇率划转。',
    actions: C.Ops([
      C.Btn({ label: '演示划转', action: 'point-transfer', primary: true }),
      C.Btn({ label: '演示过期 10 分', action: 'expire-points' }),
    ]),
    tabs: { key: 'points', current: tab, items: [{ id: 'c', title: 'C 端消费积分' }, { id: 'p', title: 'P 端产业积分' }] },
    columns: ['时间', '账户', '类型', '变动', '订单', '备注'],
    rows,
  });
}
