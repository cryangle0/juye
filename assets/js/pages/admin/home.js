import { pageCtx } from '../context.js';

export function pageHome() {
  const { db, C } = pageCtx();
  const todo = [
    ['待审入驻', db.merchants.filter((m) => m.status === '待审').length, 'merchants'],
    ['待审商品', db.products.filter((p) => p.status === '待审').length, 'product-audit'],
    ['待发货', db.orders.filter((o) => o.status === '待发货').length, 'orders'],
    ['售后', db.aftersales.filter((a) => a.status === '待审' || a.status === '待运营放行').length, 'aftersales'],
    ['提现', db.withdraws.filter((w) => w.status === '待财务审').length, 'withdraws'],
    ['对账差异', db.recon.filter((r) => r.diff).length, 'recon'],
    ['候补中', db.signups.filter((s) => s.status === '候补').length, 'events'],
    ['询价待审', db.inquiries.filter((i) => i.status === '待审批').length, 'inquiries'],
  ];
  const walk = (title, items) => C.Card({
    title,
    body: `<div class="walk-grid">${items.map((x) =>
      `<button class="walk-item" data-go="${x[2]}"><span class="walk-n">${x[0]}</span><span>${x[1]}</span></button>`
    ).join('')}</div>`,
  });
  return C.PageHeader({
    title: '工作台',
    desc: '一期商城闭环 + 二期预约/政企/排期，均可点进走查',
    actions: C.Btn({ label: '重置演示数据', action: 'reset-demo' }),
  })
    + C.MetricGrid(todo.map((t) => C.Metric({ label: t[0], value: t[1], go: t[2], tone: t[1] ? 'pending' : 'range' })))
    + `<div class="split-grid">${walk('一期主链路', [
      ['1', '商家入驻审核', 'merchants'],
      ['2', '孤品 / 一物一码', 'codes'],
      ['3', 'C 端下单（价/券/积分）', 'orders'],
      ['4', '微信支付 / 分账提现', 'withdraws'],
      ['5', 'DIY 核销防重', 'verify-records'],
      ['6', '退款回退积分', 'aftersales'],
      ['7', 'P 端月账单', 'bills'],
      ['8', '甲方溯源查询', 'traces'],
    ])}${walk('二期主链路', [
      ['1', '场地预约撞档 / 改约', 'venues'],
      ['2', '活动候补转正签到', 'events'],
      ['3', '仪式定金尾款', 'ceremonies'],
      ['4', '政企询价转单', 'inquiries'],
      ['5', '对公打款认领', 'claims'],
      ['6', '限量开售限购', 'limited'],
      ['7', 'P 端大屏档冲突', 'resources'],
      ['8', '审计与报表', 'audits'],
    ])}</div>`
    + C.Card({
      title: '快捷入口',
      body: `<div class="shortcut-grid">${[['商品库', 'product'], ['订单', 'orders'], ['会员', 'members'], ['营销券', 'coupons'], ['积分兑换', 'redeem'], ['分账流水', 'splits'], ['画师档案', 'artists'], ['核销', 'verify-records'], ['经营大盘', 'dashboard']].map(([t, g]) =>
        `<button class="shortcut-card" data-go="${g}"><span class="ico">▣</span>${t}</button>`).join('')}</div>`,
    });
}
