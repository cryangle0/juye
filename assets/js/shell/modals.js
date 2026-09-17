import { escapeHtml } from '../lib/html.js';
import { money } from '../lib/format.js';
import { getDb, product, member, merchant } from '../lib/store.js';
import { ui } from '../app/state.js';
import { Modal } from '../components/overlay.js';
import { Btn } from '../components/button.js';
import { Kv, Field, Input } from '../components/layout.js';
import { Tag } from '../components/tag.js';
import { quoteCart } from '../domain/cart.js';

export function ModalHost() {
  if (!ui.modal) return '';
  const { type, payload } = ui.modal;
  const db = getDb();
  if (type === 'order') {
    const o = db.orders.find((x) => x.id === payload.id);
    if (!o) return '';
    return Modal({
      title: '订单 ' + o.id,
      body: Kv([
        ['会员', member(o.userId)?.name],
        ['商家', merchant(o.merchantId)?.name],
        ['状态', Tag(o.status)],
        ['类型', o.type],
        ['商品', o.items.map((i) => `${product(i.productId)?.name} ×${i.qty}`).join('、')],
        ['金额', money(o.amount)],
        ['运费', money(o.freight)],
        ['券/积分', `${o.coupon || 0} / ${o.points || 0}`],
        ['履约', o.fulfill + (o.verifyCode ? ' · ' + o.verifyCode : '')],
        ['支付', o.pay + ' ' + (o.payNo || '')],
      ]),
      foot: Btn({ label: '关闭', action: 'close-modal' }),
    });
  }
  if (type === 'product') {
    const p = product(payload.id);
    return Modal({
      title: p.name,
      body: Kv([
        ['商家', merchant(p.merchantId)?.name],
        ['专区', p.zone],
        ['类型', p.type],
        ['故事', p.story],
        ['库存/锁', `${p.stock} / ${p.locked}`],
        ['一物一码', p.code || '—'],
      ]),
      foot: Btn({ label: '关闭', action: 'close-modal' }),
    });
  }
  if (type === 'merchant') {
    const m = merchant(payload.id);
    return Modal({
      title: m.name,
      body: Kv([
        ['联系人', `${m.contact} ${m.phone}`],
        ['执照', m.license],
        ['证件', m.idcard],
        ['权属', m.copyright],
        ['结算账户', m.account || '—'],
        ['驳回原因', m.reason || '—'],
      ]),
      foot: Btn({ label: '关闭', action: 'close-modal' }),
    });
  }
  if (type === 'member') {
    const m = member(payload.id);
    const rows = db.pointsC.filter((x) => x.userId === m.id).slice(0, 8)
      .map((x) => `<div class="muted">${x.at} ${x.type} ${x.delta} · ${escapeHtml(x.note)}</div>`).join('');
    return Modal({
      title: m.name,
      body: Kv([['手机', m.phone], ['成长值', m.growth], ['C积分', m.cPoints], ['标签', (m.tags || []).join('、')]]) + rows,
      foot: Btn({ label: '关闭', action: 'close-modal' }),
    });
  }
  if (type === 'verify') {
    return Modal({
      title: '补核销',
      body: Field({ label: '核销码', inner: Input({ id: 'v-code', placeholder: 'HX-8821' }), span2: true }),
      foot: Btn({ label: '核销', action: 'do-verify', primary: true }),
    });
  }
  if (type === 'price') {
    const p = product(payload.id);
    return Modal({
      title: '改价 ' + p.name,
      body: Field({ label: '指导价', inner: Input({ id: 'f-guide', value: p.guide, type: 'number' }) }),
      foot: Btn({ label: '保存并记审计', action: 'save-price', extra: `data-id="${p.id}"`, primary: true }),
    });
  }
  if (type === 'stock') {
    const p = product(payload.id);
    return Modal({
      title: '调整库存 ' + p.name,
      body: Field({ label: '增减数量（可负）', inner: Input({ id: 'f-delta', value: '1', type: 'number' }) }),
      foot: Btn({ label: '确认', action: 'save-stock', extra: `data-id="${p.id}"`, primary: true }),
    });
  }
  if (type === 'quote') {
    const q = quoteCart(ui.memberId, ui.couponId, ui.usePoints);
    return Modal({
      title: '结算明细',
      body: Kv([['商品', money(q.goods)], ['优惠券', money(q.coupon)], ['积分抵', money(q.points)], ['运费', money(q.freight)], ['应付', money(q.pay)]]),
      foot: Btn({ label: '关闭', action: 'close-modal' }),
    });
  }
  return '';
}
