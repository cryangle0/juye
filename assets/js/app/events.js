import { ui } from './state.js';
import { navigate } from './router.js';
import { closeModal } from './feedback.js';
import { dispatch, login } from '../actions/index.js';
import { render } from './render.js';

const GO_PRODUCT = new Set(['mini-detail', 'mini-review']);
const GO_ORDER = new Set(['mini-order', 'mini-pay', 'mini-invoice']);

let qTimer = 0;

function closeChrome() {
  if (!ui.notifyOpen && !ui.userMenuOpen) return false;
  ui.notifyOpen = false;
  ui.userMenuOpen = false;
  return true;
}

function onClick(e) {
  if (e.target.classList.contains('modal-mask')) {
    closeModal();
    return;
  }

  const t = e.target.closest('[data-go],[data-action],[data-tab],#btn-login');
  if (e.target.closest('.modal') && !t) return;

  if (!e.target.closest('.notify-wrap, .user-wrap') && closeChrome()) {
    if (!t) {
      render();
      return;
    }
  }

  if (!t) return;
  if (t.id === 'btn-login') {
    e.preventDefault();
    login();
    return;
  }
  if (t.dataset.tab) {
    const [key, id] = t.dataset.tab.split(':');
    ui.tabs[key] = id;
    render();
    return;
  }
  if (t.dataset.go) {
    if (t.dataset.id) {
      if (GO_PRODUCT.has(t.dataset.go)) ui.productId = t.dataset.id;
      if (GO_ORDER.has(t.dataset.go)) ui.orderId = t.dataset.id;
      if (t.dataset.go === 'mini-artist') ui.artistId = t.dataset.id;
      if (t.dataset.go === 'mini-zone') ui.tabs.zone = t.dataset.id;
    }
    navigate(t.dataset.go);
    return;
  }
  if (t.dataset.action) {
    e.preventDefault();
    dispatch(t.dataset.action, t);
  }
}

function onKey(e) {
  if (e.key === 'Escape') {
    if (ui.modal) closeModal();
    else if (ui.confirm) { ui.confirm = null; render(); }
    else if (closeChrome()) render();
    return;
  }
  if (e.key !== 'Enter') return;
  if (e.target?.id === 'login-pass' || e.target?.id === 'login-user') {
    login();
    return;
  }
  if (e.target?.id === 'f-q') {
    ui.q = e.target.value.trim();
    render();
    return;
  }
  if (e.target?.id === 'f-code') {
    dispatch('trace-q', e.target);
    return;
  }
  if (e.target?.id === 'v-code') {
    dispatch('do-verify', e.target);
  }
}

function onInput(e) {
  if (e.target.id !== 'f-q') return;
  ui.q = e.target.value;
  clearTimeout(qTimer);
  qTimer = setTimeout(() => render(), 180);
}

function onChange(e) {
  ui.filters ||= { zone: '', artist: '', kind: '' };
  if (e.target.id === 'f-coupon') {
    ui.couponId = e.target.value;
    render();
  }
  if (e.target.id === 'f-points') {
    ui.usePoints = e.target.checked;
    render();
  }
  if (e.target.id === 'f-zone') ui.filters.zone = e.target.value;
  if (e.target.id === 'f-artist') ui.filters.artist = e.target.value;
  if (e.target.id === 'f-kind') ui.filters.kind = e.target.value;
  if (e.target.id === 'f-fulfill') ui.fulfill = e.target.value;
  if (e.target.id === 'f-paykind') ui.payKind = e.target.value;
}

export function bindEvents() {
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
}
