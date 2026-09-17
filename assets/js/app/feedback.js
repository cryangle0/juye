import { ui } from './state.js';
import { render } from './render.js';

let toastTimer = 0;

export function toast(msg, kind = 'ok') {
  ui.toast = { msg, kind, id: Date.now() };
  render();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    ui.toast = null;
    const wrap = document.querySelector('.toast-wrap');
    if (wrap) wrap.innerHTML = '';
  }, 2400);
}

export function ask({ title, message, danger, okText, input, payload, action }) {
  ui.confirm = { title, message, danger, okText, input, payload, action };
  render();
}

export function closeConfirm() {
  ui.confirm = null;
}

export function openModal(type, payload = {}) {
  ui.modal = { type, payload };
  render();
}

export function closeModal() {
  ui.modal = null;
  render();
}

export function withLoading(text, fn) {
  ui.loading = text || '处理中…';
  render();
  return Promise.resolve().then(fn).finally(() => {
    ui.loading = false;
    render();
  });
}

export function flash(res) {
  if (!res) return false;
  toast(res.msg, res.ok ? 'ok' : 'err');
  return !!res.ok;
}
