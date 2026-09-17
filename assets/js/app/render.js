import { ui } from './state.js';
import { ensureRoute } from './guard.js';
import { LoginView } from '../shell/login.js';
import { AdminLayout } from '../shell/layout-admin.js';
import { MiniLayout } from '../shell/layout-mini.js';
import { ModalHost } from '../shell/modals.js';
import { Confirm, Toast, Loading } from '../components/overlay.js';

let lastFocus = '';

export function render() {
  const app = document.getElementById('app');
  if (!app) return;
  if (ui.loggedIn) ensureRoute();
  const active = document.activeElement;
  lastFocus = active && active.id ? active.id : '';
  const sel = active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null;

  const shell = !ui.loggedIn
    ? LoginView()
    : (ui.mode === 'mini' ? MiniLayout() : AdminLayout());

  app.innerHTML = shell
    + ModalHost()
    + Confirm(ui.confirm)
    + (ui.loading ? Loading({ text: ui.loading }) : '')
    + Toast(ui.toast);

  if (lastFocus) {
    const el = document.getElementById(lastFocus);
    if (el) {
      el.focus();
      if (sel && el.setSelectionRange) {
        try { el.setSelectionRange(sel[0], sel[1]); } catch (_) {}
      }
    }
  }
}
