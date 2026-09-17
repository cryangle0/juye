import { escapeHtml } from '../lib/html.js';
import { ACCOUNTS } from '../data/constants.js';
import { ui } from '../app/state.js';

export function LoginView() {
  const tab = ui.loginTab;
  const tabs = [
    ['admin', '平台后台'],
    ['merchant', 'P 端商家'],
    ['enterprise', '政企 B'],
    ['store', '核销端'],
    ['mini', 'C 端小程序'],
  ];
  const demo = {
    admin: 'admin / ops / finance / cs · 密码 demo',
    merchant: 'painter（画院）/ craftshop（笺社）· demo',
    enterprise: 'corp / corpsub · demo',
    store: 'store · demo',
    mini: '进入后可切换 游客/四级会员',
  };
  const user = {
    admin: 'admin', merchant: 'painter', enterprise: 'corp', store: 'store', mini: 'm2',
  }[tab];
  return `<div class="login-wrap"><div class="login-card login-card--wide">
    <div class="login-brand"><img src="assets/logo.svg" alt="" /><h1>巨野揽月红樽</h1></div>
    <p class="login-sub">线上会员商城 · 一期+二期可走查原型</p>
    <div class="login-tabs login-tabs-wrap">
      ${tabs.map(([id, label]) => `<button type="button" class="${tab === id ? 'active' : ''}" data-action="login-tab" data-tab-id="${id}">${label}</button>`).join('')}
    </div>
    <div class="form-field"><label>账号</label><input class="field-input" id="login-user" value="${user}" autocomplete="username" /></div>
    <div class="form-field"><label>密码</label><input class="field-input" id="login-pass" type="password" value="demo" autocomplete="current-password" /></div>
    <p class="login-hint">${escapeHtml(demo[tab])}</p>
    <button class="btn btn-primary btn-block" id="btn-login">${tab === 'mini' ? '进入小程序' : '进入系统'}</button>
    <button class="btn btn-block" data-action="reset-demo" style="margin-top:8px">重置演示数据</button>
  </div></div>`;
}

export function accountOptions(mode) {
  return ACCOUNTS.filter((a) => a.mode === (mode === 'mini' ? 'admin' : mode) || (mode === 'mini'));
}
