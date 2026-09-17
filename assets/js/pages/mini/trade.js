import { pageCtx } from '../context.js';
import { quoteCart } from '../../domain/cart.js';
import { member, product } from '../../lib/store.js';
import { ui } from '../../app/state.js';
import { money } from '../../lib/format.js';

export function pageMiniCart() {
  const { db, C } = pageCtx();
  const m = member(ui.memberId);
  if (!m) return C.Empty({ text: '请先切换为会员', go: 'mini-home', actionLabel: '回首页' });
  const q = quoteCart(m.id, ui.couponId, ui.usePoints);
  if (!q.items.length) return `<div class="mini-page-title">购物车</div>` + C.Empty({ text: '还没有商品', go: 'mini-zone', actionLabel: '去专区看看' });
  const coupons = db.coupons.filter((c) => c.user === m.id && c.status === '可用');
  const depositable = q.items.length && q.items.every((it) => it.p.presale);
  return `<div class="mini-page-title">购物车</div>
    <div class="mini-goods">${q.items.map((it) => `<div class="mini-sn-card">
      <strong>${it.p.cover} ${C.escapeHtml(it.p.name)}</strong>
      <div class="muted">${money(it.price)} · 小计 ${money(it.sub)}</div>
      <div class="qty-row">
        ${C.Btn({ label: '−', action: 'cart-minus', extra: `data-id="${it.productId}"`, size: 'sm' })}
        <span>${it.qty}</span>
        ${C.Btn({ label: '+', action: 'cart-plus', extra: `data-id="${it.productId}"`, size: 'sm' })}
        ${C.Btn({ label: '移除', action: 'cart-remove', extra: `data-id="${it.productId}"`, size: 'sm' })}
      </div>
    </div>`).join('')}</div>
    <div class="form-field"><label>优惠券</label>
      <select class="field-input" id="f-coupon">${['', ...coupons.map((c) => c.id)].map((id) =>
        `<option value="${id}" ${id === ui.couponId ? 'selected' : ''}>${id ? coupons.find((c) => c.id === id).name : '不使用优惠券'}</option>`).join('')}
      </select>
    </div>
    <label class="check-item"><input type="checkbox" id="f-points" ${ui.usePoints ? 'checked' : ''}/> 使用积分抵现（上限已按规则计算）</label>
    <div class="form-field"><label>履约方式</label>
      <select class="field-input" id="f-fulfill">
        <option value="快递" ${ui.fulfill === '快递' ? 'selected' : ''}>快递</option>
        <option value="自提" ${ui.fulfill === '自提' ? 'selected' : ''}>自提</option>
        <option value="到店核销" ${ui.fulfill === '到店核销' ? 'selected' : ''}>到店核销</option>
      </select>
    </div>
    ${depositable ? `<div class="form-field"><label>预售支付</label>
      <select class="field-input" id="f-paykind">
        <option value="full">全款</option>
        <option value="deposit">只付定金</option>
      </select>
    </div>` : ''}
    ${C.PaySheet({ rows: [
      { k: '商品', v: money(q.goods) },
      { k: '优惠券', v: '-' + money(q.coupon) },
      { k: '积分抵', v: '-' + money(q.points) },
      { k: '运费', v: money(q.freight) },
    ], pay: q.pay })}
    ${C.Btn({ label: '去结算（按商家拆单）', action: 'checkout', primary: true, block: true, size: '' })}`;
}

export function pageMiniCheckout() {
  return pageMiniCart();
}

export function pageMiniPay() {
  const { C } = pageCtx();
  const o = ui.orderId;
  return `<div class="mini-page-title">支付</div>
    <p class="mini-page-desc">演示调起微信 / 支付宝通道，回调后完成订单并写甲方分账流水。</p>
    ${C.Btn({ label: '微信支付', action: 'pay-order', extra: `data-id="${o}" data-channel="微信"`, primary: true, block: true, size: '' })}
    ${C.Btn({ label: '支付宝（H5 备用）', action: 'pay-order', extra: `data-id="${o}" data-channel="支付宝"`, block: true, size: '' })}
    ${C.Btn({ label: '取消并释放库存', action: 'cancel-order', extra: `data-id="${o}"`, block: true, size: '' })}`;
}

export function pageMiniOrders() {
  const { db, C } = pageCtx();
  const list = db.orders.filter((o) => o.userId === ui.memberId);
  return `<div class="mini-page-title">我的订单</div>`
    + C.MiniList(list.map((o) => C.MiniItem({
      title: o.id, meta: `${o.type} · ${o.status} · ${money(o.amount)}`, go: 'mini-order', id: o.id,
    })))
    + (list.length ? '' : C.Empty({ text: '暂无订单', go: 'mini-zone', actionLabel: '去逛逛' }));
}

export function pageMiniOrder() {
  const { db, C } = pageCtx();
  const o = db.orders.find((x) => x.id === ui.orderId) || db.orders[0];
  return `<div class="mini-page-title">订单详情</div>
    ${C.Card({ body: C.Kv([
      ['状态', C.Tag(o.status)],
      ['支付', o.pay || '—'],
      ['商品', o.items.map((i) => `${product(i.productId)?.name}×${i.qty}`).join('、')],
      ['履约', o.fulfill],
      ['核销码', o.verifyCode ? `${o.verifyCode}${o.timesLeft ? ` · 余${o.timesLeft}次` : ''}` : '—'],
      ['物流', o.express || '—'],
      ['轨迹', (o.trace || []).join(' → ') || '—'],
    ]) })}
    ${o.status === '待支付' ? C.Btn({ label: '去支付', go: 'mini-pay', extra: `data-id="${o.id}"`, primary: true, block: true, size: '' }) : ''}
    ${['待发货', '已发货', '已完成'].includes(o.status) ? C.Btn({ label: '申请售后', action: 'apply-as', extra: `data-id="${o.id}"`, block: true, size: '' }) : ''}
    ${['待发货', '已发货', '已完成', '待核销', '待履约'].includes(o.status) ? C.Btn({ label: '申请发票', go: 'mini-invoice', extra: `data-id="${o.id}"`, block: true, size: '' }) : ''}
    ${o.status === '已完成' ? C.Btn({ label: '写评价', go: 'mini-review', extra: `data-id="${o.items[0].productId}"`, block: true, size: '' }) : ''}`;
}

export function pageMiniInvoice() {
  const { db, C } = pageCtx();
  const o = db.orders.find((x) => x.id === ui.orderId) || db.orders.find((x) => x.userId === ui.memberId);
  const list = db.invoices.filter((i) => i.orderId === o?.id);
  return `<div class="mini-page-title">发票申请</div>
    <p class="mini-page-desc">个人/企业信息登记，财务回填票号。不接税控。</p>
    ${o ? C.Alert({ kind: 'info', text: '订单 ' + o.id }) : ''}
    ${C.Field({ label: '抬头', inner: C.Input({ id: 'f-inv-title', value: member(ui.memberId)?.name || '' }) })}
    ${C.Field({ label: '类型', inner: `<select class="field-input" id="f-inv-kind"><option>个人</option><option>企业</option></select>` })}
    ${C.Field({ label: '税号（企业）', inner: C.Input({ id: 'f-inv-tax', placeholder: '选填' }) })}
    ${C.Btn({ label: '提交申请', action: 'apply-invoice', extra: `data-id="${o?.id || ''}"`, primary: true, block: true, size: '' })}
    ${C.Card({ title: '申请记录', body: list.map((i) => `<div>${i.kind} ${C.Tag(i.status)} ${i.no || '待回填'}</div>`).join('') || '暂无' })}`;
}
