import { ZONES } from '../../data/constants.js';
import { pageCtx } from '../context.js';
import { canSeeZone, priceOf } from '../../domain/catalog.js';
import { cartCount } from '../../domain/cart.js';
import { member } from '../../lib/store.js';
import { levelName } from '../../lib/names.js';
import { ui } from '../../app/state.js';

export function pageMiniHome() {
  const { db, C } = pageCtx();
  const m = member(ui.memberId);
  const n = m ? cartCount(m.id) : 0;
  return C.MiniHero({
    title: m ? `你好，${m.name}` : '欢迎来到揽月红樽',
    desc: m ? `${levelName(m.level)} · C积分 ${m.cPoints}` : '登录会员后可按等级进入专区',
  })
    + `<div class="mini-zones">${ZONES.map((z) => {
      const ok = m ? canSeeZone(m.level, z.id) : z.id === 'craft';
      return `<button class="mini-zone" data-go="mini-zone" data-id="${z.id}">
        <strong>${z.name}</strong>
        <div class="muted">${z.price}</div>
        ${ok ? '' : '<div class="lock-hint">等级不足</div>'}
      </button>`;
    }).join('')}</div>`
    + `<button class="banner live" data-go="mini-limited" style="width:100%;margin:8px 0">
        <h3>直播专区</h3><p>跳转甲方视频号 / 直播间（不含直播中台）</p>
      </button>`
    + C.Btn({ label: '搜索商品', go: 'mini-search', block: true, size: '' })
    + (n ? `<div class="mini-cartbar"><span>购物车 ${n} 件</span>${C.Btn({ label: '去结算', go: 'mini-cart', primary: true })}</div>` : '');
}

export function pageMiniZone() {
  const { db, C } = pageCtx();
  const m = member(ui.memberId);
  const zone = ui.tabs.zone || 'craft';
  const list = db.products.filter((p) => p.zone === zone && p.status === '上架');
  return `<div class="mini-page-title">${ZONES.find((z) => z.id === zone)?.name || '专区'}</div>`
    + C.Seg({ key: 'zone', current: zone, items: ZONES.map((z) => ({ id: z.id, title: z.name.slice(0, 4) })) })
    + `<div class="mini-goods">${list.map((p) => {
      const locked = m ? !canSeeZone(m.level, p.zone) : p.zone !== 'craft';
      return C.MiniGood({ p, price: priceOf(p, m?.level || 'l1'), locked });
    }).join('') || C.Empty({ text: '该专区暂无上架' })}</div>`;
}

export function pageMiniSearch() {
  const { ui: u, db, C } = pageCtx();
  const q = (u.q || '').trim();
  const m = member(u.memberId);
  const list = db.products.filter((p) => p.status === '上架' && (!q || p.name.includes(q) || p.story.includes(q)));
  return `<div class="mini-page-title">搜索</div>`
    + `<input class="field-input" id="f-q" placeholder="关键词 / 画师 / 专区" value="${C.escapeHtml(q)}" />`
    + C.Btn({ label: '搜索', action: 'apply-filter', primary: true, block: true, size: '' })
    + `<div class="mini-goods" style="margin-top:10px">${list.map((p) => C.MiniGood({ p, price: priceOf(p, m?.level || 'l1'), locked: m ? !canSeeZone(m.level, p.zone) : false })).join('')}</div>`;
}

export function pageMiniDetail() {
  const { db, C } = pageCtx();
  const p = db.products.find((x) => x.id === ui.productId) || db.products[0];
  const m = member(ui.memberId);
  const locked = m ? !canSeeZone(m.level, p.zone) : p.zone !== 'craft';
  const price = priceOf(p, m?.level || 'l1');
  return `<button class="btn btn-sm" data-go="mini-zone">返回</button>
    <div class="goods-cover" style="height:140px;border-radius:16px;margin:10px 0;font-size:48px">${p.cover}</div>
    <div class="mini-page-title">${C.escapeHtml(p.name)}</div>
    <div class="price-stack"><span class="price-now">${C.money(price)}</span><span class="price-guide">${C.money(p.guide)}</span></div>
    <p class="mini-page-desc">${C.escapeHtml(p.story)}</p>
    ${p.type === 'unique' ? C.Alert({ kind: 'warn', text: '孤品一码一件，售出即不可再卖。黑钻可预约鉴赏/提货。' }) : ''}
    ${p.limited ? C.Alert({ kind: 'info', text: `开售 ${p.saleAt} · 限购 ${p.limitPer} 件` }) : ''}
    ${locked ? C.Alert({ kind: 'warn', text: '当前等级不可购买该专区' }) : ''}
    ${C.Btn({ label: '查甲方溯源', go: 'mini-trace', extra: `data-code="${p.code || 'LY-2026-0007'}"`, block: true, size: '' })}
    ${p.type === 'ceremony' ? C.Btn({ label: `电话约档 ${p.phone}`, action: 'toast', extra: `data-msg="请拨打 ${p.phone}（线上不定档）"` , block: true, size: '' }) : ''}
    ${C.Btn({ label: locked ? '等级不足' : (p.stock ? '加入购物车' : '已售罄'), action: locked || !p.stock ? 'toast' : 'add-cart', extra: `data-id="${p.id}" data-msg="${locked ? '请升级会员' : '已售罄'}"`, primary: !locked && p.stock, block: true, size: '' })}`;
}

export function pageMiniTrace() {
  const { db, C } = pageCtx();
  const t = db.traces[0];
  return `<div class="mini-page-title">溯源核验</div>
    <p class="mini-page-desc">调甲方存证接口展示，自建链不含。</p>
    ${C.Card({ body: C.Kv([['编码', t.code], ['作品', t.title], ['作者', t.artist], ['存证', t.chain], ['结果', C.Tag(t.result, 'green')]]) })}
    ${C.Field({ label: '输入编码', inner: C.Input({ id: 'f-code', placeholder: 'LY-2026-0007' }) })}
    ${C.Btn({ label: '查询', action: 'trace-q', primary: true, block: true, size: '' })}`;
}
