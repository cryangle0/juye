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
  return `<div class="mini-page-title">购物车</div>
    <div class="mini-goods">${q.items.map((it) => `<div class="mini-sn-card">
      <strong>${it.p.cover} ${C.escapeHtml(it.p.name)}</strong>
      <div class="muted">×${it.qty} · ${money(it.price)}</div>
    </div>`).join('')}</div>
    <div class="form-field"><label>优惠券</label>
      <select class="field-input" id="f-coupon">${['', ...coupons.map((c) => c.id)].map((id) =>
        `<option value="${id}" ${id === ui.couponId ? 'selected' : ''}>${id ? coupons.find((c) => c.id === id).name : '不使用优惠券'}</option>`).join('')}
      </select>
    </div>
    <label class="check-item"><input type="checkbox" id="f-points" ${ui.usePoints ? 'checked' : ''}/> 使用积分抵现（上限已按规则计算）</label>
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
  return `<div class="mini-page-title">微信支付</div>
    <p class="mini-page-desc">演示调起微信通道，回调后完成订单。</p>
    ${C.Btn({ label: '模拟支付成功', action: 'pay-order', extra: `data-id="${o}"`, primary: true, block: true, size: '' })}
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
      ['商品', o.items.map((i) => `${product(i.productId)?.name}×${i.qty}`).join('、')],
      ['履约', o.fulfill],
      ['核销码', o.verifyCode || '—'],
      ['物流', o.express || '—'],
    ]) })}
    ${o.status === '待支付' ? C.Btn({ label: '去支付', go: 'mini-pay', extra: `data-id="${o.id}"`, primary: true, block: true, size: '' }) : ''}
    ${['待发货', '已发货', '已完成'].includes(o.status) ? C.Btn({ label: '申请售后', action: 'apply-as', extra: `data-id="${o.id}"`, block: true, size: '' }) : ''}
    ${o.status === '已完成' ? C.Btn({ label: '写评价', go: 'mini-review', extra: `data-id="${o.items[0].productId}"`, block: true, size: '' }) : ''}`;
}
