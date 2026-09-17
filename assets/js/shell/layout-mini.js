import { escapeHtml } from '../lib/html.js';
import { MINI_MEMBERS } from '../data/constants.js';
import { ui } from '../app/state.js';
import { miniTabs } from './menus.js';
import { getPage } from '../pages/registry.js';
import { MINI_ICONS } from '../components/mini.js';

function chips() {
  if (ui.mode !== 'mini') return '';
  return `<div class="mini-role-switch">
    <button type="button" class="mini-role-chip on" data-action="toggle-h5">${ui.client === 'h5' ? 'H5同号' : '小程序'}</button>
    ${MINI_MEMBERS.map((m) =>
    `<button type="button" class="mini-role-chip ${ui.memberId === m.id ? 'on' : ''}" data-action="mini-member" data-id="${m.id}">${escapeHtml(m.name.slice(-2))}</button>`
  ).join('')}</div>`;
}

export function MiniLayout() {
  const kind = ui.role === 'store' ? 'verify' : ui.mode === 'merchant' ? 'p' : 'c';
  const tabs = miniTabs(kind);
  const page = getPage(ui.route);
  const active = (id) => {
    if (id === 'mini-home') return ui.route === 'mini-home' || ui.route === 'mini-zone' || ui.route === 'mini-search';
    if (id === 'mini-cart') return ['mini-cart', 'mini-checkout', 'mini-pay'].includes(ui.route);
    if (id === 'mini-wallet') return ['mini-wallet', 'mini-points', 'mini-book', 'mini-event', 'mini-redeem'].includes(ui.route);
    if (id === 'mini-mine') return ui.route.startsWith('mini-mine') || ['mini-orders', 'mini-order', 'mini-invoice', 'mini-nft', 'mini-privacy', 'mini-invite', 'mini-msg'].includes(ui.route);
    return ui.route === id;
  };
  return `<div class="mini-stage">
    <div class="mini-phone">
      <div class="mini-phone-bar">
        <span>揽月红樽</span>
        ${chips()}
      </div>
      <div class="mini-phone-body"><div class="mini-scroll">${page ? page() : ''}</div></div>
      <nav class="mini-tabbar">
        ${tabs.map((t) => `<button type="button" class="mini-tab ${active(t.id) ? 'active' : ''}" data-go="${t.id}">
          <span class="mini-tab-ico">${MINI_ICONS[t.icon] || ''}</span>
          <span class="mini-tab-label">${escapeHtml(t.title)}</span>
        </button>`).join('')}
      </nav>
    </div>
    <p class="mini-stage-hint">顶栏切换会员等级 · 底栏为小程序导航 · 与 PC 共用同一套数据</p>
    <button class="btn btn-sm" data-action="to-pc">返回管理端登录</button>
  </div>`;
}
