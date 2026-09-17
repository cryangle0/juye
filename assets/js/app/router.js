import { ui } from './state.js';
import { getPage } from '../pages/registry.js';
import { canAccess } from './guard.js';
import { render } from './render.js';

export function navigate(id) {
  if (!getPage(id)) {
    import('./feedback.js').then(({ toast }) => toast('页面不存在', 'err'));
    return;
  }
  if (ui.loggedIn && !canAccess(ui.mode, id)) {
    import('./feedback.js').then(({ toast }) => toast('当前角色看不到该页面', 'err'));
    return;
  }
  ui.route = id;
  location.hash = id;
  ui.modal = null;
  ui.confirm = null;
  ui.notifyOpen = false;
  ui.userMenuOpen = false;
  render();
}

export function bootHash() {
  const id = (location.hash || '').replace('#', '');
  if (id && getPage(id)) ui.route = id;
  window.addEventListener('hashchange', () => {
    const next = (location.hash || '').replace('#', '');
    if (next && getPage(next) && next !== ui.route) navigate(next);
  });
}
