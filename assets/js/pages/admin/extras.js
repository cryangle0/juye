import { pageCtx } from '../context.js';
import { merchantName, matchQuery } from '../../lib/names.js';
import { money } from '../../lib/format.js';

export function pageArtists() {
  const { db, C } = pageCtx();
  const list = db.artists || [];
  return C.DataTablePage({
    title: '画师档案',
    desc: '与商品、一物一码绑定。贡献度见商品分析。',
    columns: ['画师', '所属店', '简介', '在售作品'],
    rows: list.map((a) => C.tr([
      C.escapeHtml(a.name), merchantName(db, a.shop), C.escapeHtml(a.bio),
      db.products.filter((p) => p.artistId === a.id).length + ' / 档案 ' + a.works,
    ])),
  });
}

export function pageMedia() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '素材库',
    desc: '图/视频/故事复用。先审后发，不做智能机审。',
    columns: ['素材', '类型', '用于', '状态'],
    rows: (db.media || []).map((m) => C.tr([C.escapeHtml(m.name), m.kind, m.used, C.Tag(m.status)])),
  });
}

export function pageRedeem() {
  const { db, C } = pageCtx();
  return C.PageHeader({ title: 'C 端积分兑换物', desc: '兑换扣 C 积分，生成可核销凭证。先上 6 个兑换物。' })
    + C.Card({
      body: C.Table({
        columns: ['兑换物', '积分', '类型'],
        rows: (db.redeemItems || []).map((r) => C.tr([r.name, r.cost, r.kind])),
      }),
    })
    + C.Card({
      title: '已兑凭证',
      body: C.Table({
        columns: ['凭证', '会员', '物品', '状态', '时间'],
        empty: '暂无兑换',
        rows: (db.redeemVouchers || []).map((v) => C.tr([v.code, v.userId, v.name, C.Tag(v.status), v.at])),
      }),
    });
}

export function pageSplits() {
  const { db, C } = pageCtx();
  return C.DataTablePage({
    title: '分账流水',
    desc: '成交后按档位调甲方清分接口。不做自建二清钱包。',
    columns: ['流水', '订单', '商家', '货款', '商家分成', '平台', '状态', '时间'],
    rows: (db.splits || []).map((s) => C.tr([
      s.id, s.orderId, merchantName(db, s.merchantId), money(s.goods), money(s.merchant), money(s.platform), C.Tag(s.status), s.at,
    ])),
  });
}

export function pageAudits() {
  const { ui, db, C } = pageCtx();
  const list = (db.audits || []).filter((a) => matchQuery(a, ui.q, ['who', 'action', 'cat', 'at']));
  return C.DataTablePage({
    title: '审计日志',
    desc: '入驻审核、改价、退款、分账、预约改档、对公认领只追加不可改。',
    search: { value: ui.q, placeholder: '操作人 / 分类 / 内容' },
    columns: ['时间', '分类', '操作人', '内容'],
    rows: list.map((a) => C.tr([a.at, C.Tag(a.cat, 'blue'), a.who, C.escapeHtml(a.action)])),
  });
}