import { ACCOUNTS, MINI_MEMBERS, LEVELS } from '../data/constants.js';
import { reset, getDb, save, audit } from '../lib/store.js';
import { ui, applyAccount } from '../app/state.js';
import { toast, flash, ask, closeConfirm, openModal, closeModal, withLoading } from '../app/feedback.js';
import { navigate } from '../app/router.js';
import { defaultRoute } from '../shell/menus.js';
import { canAccess, ensureRoute } from '../app/guard.js';
import { getPage } from '../pages/registry.js';
import { render } from '../app/render.js';
import * as D from '../domain/index.js';

export const val = (id) => document.getElementById(id)?.value?.trim() || '';
export const checked = (id) => !!document.getElementById(id)?.checked;

export function handleResult(res, go) {
  if (flash(res) && go) navigate(go);
  else render();
}

export const actions = {
  'login-tab'(el) {
    ui.loginTab = el.dataset.tabId;
    render();
  },
  'reset-demo'() {
    reset();
    toast('演示数据已重置');
    render();
  },
  logout() {
    ui.loggedIn = false;
    location.hash = '';
    render();
  },
  'toggle-notify'() { ui.notifyOpen = !ui.notifyOpen; ui.userMenuOpen = false; render(); },
  'toggle-user-menu'() { ui.userMenuOpen = !ui.userMenuOpen; ui.notifyOpen = false; render(); },
  'mark-all-read'() {
    getDb().notifications.forEach((n) => { n.read = true; });
    save();
    ui.notifyOpen = true;
    render();
  },
  'read-notify'(el) {
    const n = getDb().notifications.find((x) => x.id === el.dataset.id);
    if (n) { n.read = true; save(); if (n.go) navigate(n.go); }
  },
  'switch-account'(el) {
    applyAccount(el.dataset.id);
    ui.userMenuOpen = false;
    ensureRoute();
    toast('已切换为 ' + el.dataset.id);
    render();
  },
  'to-mini'() {
    ui.mode = 'mini';
    ui.loggedIn = true;
    ui.memberId = 'm2';
    navigate('mini-home');
  },
  'to-pc'() {
    ui.loggedIn = false;
    ui.mode = 'admin';
    location.hash = '';
    render();
  },
  'mini-member'(el) {
    ui.memberId = el.dataset.id;
    const m = MINI_MEMBERS.find((x) => x.id === el.dataset.id);
    toast('当前身份：' + m.name);
    render();
  },
  'close-modal': closeModal,
  'confirm-cancel'() { closeConfirm(); render(); },
  'open-modal'(el) { openModal(el.dataset.modal, { id: el.dataset.id }); },
  'apply-filter'() {
    ui.q = val('f-q');
    ui.couponId = val('f-coupon');
    ui.usePoints = document.getElementById('f-points') ? checked('f-points') : ui.usePoints;
    render();
  },
  toast(el) { toast(el.dataset.msg || '已处理'); },
  'confirm-cancel-account'() {
    ask({
      title: '注销账号',
      message: '注销后将删除/匿名化会员数据，且不可恢复。',
      danger: true,
      okText: '确认注销',
      action: 'do-cancel-account',
    });
    render();
  },
  'do-cancel-account'() {
    toast('已提交注销（演示匿名化）', 'ok');
    closeConfirm();
    render();
  },
};

export function login() {
  const user = val('login-user');
  const pass = val('login-pass') || 'demo';
  if (ui.loginTab === 'mini') {
    ui.loggedIn = true;
    ui.mode = 'mini';
    ui.memberId = MINI_MEMBERS.some((m) => m.id === user) ? user : 'm2';
    navigate('mini-home');
    toast('已进入 C 端小程序');
    return;
  }
  const acc = ACCOUNTS.find((a) => a.id === user);
  if (!acc || (pass !== acc.pass && pass !== 'demo' && pass.length < 6)) {
    toast('账号或密码不正确', 'err');
    return;
  }
  applyAccount(acc);
  ui.loggedIn = true;
  const hash = (location.hash || '').replace('#', '');
  ui.route = (hash && getPage(hash) && canAccess(acc.mode, hash)) ? hash : defaultRoute(acc.mode);
  location.hash = ui.route;
  toast('欢迎，' + acc.name);
  render();
}

export { D, navigate, toast, flash, ask, withLoading, render, audit, save, getDb, ui, LEVELS };
