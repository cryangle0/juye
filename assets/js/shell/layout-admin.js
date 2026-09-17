import { escapeHtml } from '../lib/html.js';
import { TITLES } from '../data/constants.js';
import { ACCOUNTS } from '../data/constants.js';
import { getDb } from '../lib/store.js';
import { ui, who } from '../app/state.js';
import { menusFor } from './menus.js';
import { getPage } from '../pages/registry.js';

const MODE_LABEL = {
  admin: '管理后台', merchant: 'P 端后台', enterprise: '政企后台', store: '核销后台',
};

export function AdminLayout() {
  const menus = menusFor(ui.mode);
  const title = TITLES[ui.route] || '页面';
  const page = getPage(ui.route);
  const role = who();
  const notes = getDb().notifications || [];
  const unread = notes.filter((n) => !n.read).length;
  const switchRoles = ACCOUNTS.filter((a) => a.mode === ui.mode);
  const homeGo = menus[0]?.items[0]?.id || 'home';
  return `<div class="app-bg"><div class="canvas">
    <header class="topbar">
      <div class="brand" data-go="${homeGo}">
        <img src="assets/logo.svg" alt="" /><span>巨野揽月红樽 · ${MODE_LABEL[ui.mode]}</span>
      </div>
      <div class="topbar-right">
        <div class="mode-switch">
          <button type="button" class="active">${MODE_LABEL[ui.mode]}</button>
          <button type="button" data-action="to-mini">C 端小程序</button>
        </div>
        <div class="notify-wrap">
          <button type="button" class="notify-btn" data-action="toggle-notify">🔔${unread ? `<span class="notify-badge">${unread}</span>` : ''}</button>
          ${ui.notifyOpen ? `<div class="notify-panel">
            <div class="notify-hd"><strong>通知中心</strong><button class="btn btn-sm" data-action="mark-all-read">全部已读</button></div>
            ${notes.slice(0, 20).map((n) => `<button type="button" class="notify-item ${n.read ? '' : 'unread'}" data-action="read-notify" data-id="${n.id}">
              <div class="notify-title">${escapeHtml(n.title)}</div>
              <div class="notify-body">${escapeHtml(n.body)}</div>
              <div class="notify-meta">${escapeHtml(n.time)}</div>
            </button>`).join('') || '<div class="empty-hint" style="padding:16px">暂无通知</div>'}
          </div>` : ''}
        </div>
        <div class="user-wrap">
          <button type="button" class="user" data-action="toggle-user-menu">
            <span class="user-avatar">${role.avatar}</span>
            <span class="user-name">${escapeHtml(role.name)}</span>
            <span class="user-caret">▾</span>
          </button>
          ${ui.userMenuOpen ? `<div class="user-menu">
            <div class="user-menu-hd"><strong>${escapeHtml(role.name)}</strong><span class="muted">${escapeHtml(role.id)} / demo</span></div>
            ${switchRoles.map((a) => `<button class="user-menu-item" data-action="switch-account" data-id="${a.id}">${escapeHtml(a.name)}</button>`).join('')}
            <button class="user-menu-item user-menu-item--danger" data-action="logout">退出登录</button>
          </div>` : ''}
        </div>
      </div>
    </header>
    <div class="panel">
      <aside class="sidebar"><div class="sidebar-scroll">
        ${menus.map((g) => `<div class="nav-group-title">${g.group}</div>${g.items.map((it) =>
          `<button class="nav-item ${ui.route === it.id ? 'active' : ''}" data-go="${it.id}">
            <span class="icon">${it.icon}</span><span>${it.title}</span>
            ${it.badge ? `<span class="menu-badge">${it.badge}</span>` : ''}
          </button>`).join('')}`).join('')}
      </div></aside>
      <main class="content">
        <div class="content-bar"><span>首页</span><span class="sep">/</span><strong>${escapeHtml(title)}</strong></div>
        <div class="content-body"><div class="page page--scroll">${page ? page() : '<div class="empty-hint">页面未注册</div>'}</div></div>
      </main>
    </div>
  </div></div>`;
}
