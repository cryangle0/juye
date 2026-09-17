import { ACCOUNTS } from '../data/constants.js';

export const ui = {
  loggedIn: false,
  mode: 'admin', // admin | merchant | enterprise | store | mini
  role: 'admin',
  account: 'admin',
  merchantId: 'M1',
  enterpriseId: 'E1',
  memberId: 'm2',
  route: 'home',
  tabs: {},
  q: '',
  modal: null,
  confirm: null,
  toast: null,
  loading: false,
  notifyOpen: false,
  userMenuOpen: false,
  loginTab: 'admin',
  productId: 'P01',
  orderId: '',
  couponId: '',
  usePoints: true,
  filters: { zone: '', artist: '', kind: '' },
  channel: '微信',
  fulfill: '快递',
  payKind: 'full',
  client: 'mini',
  artistId: 'A1',
};

export function applyAccount(acc) {
  const a = typeof acc === 'string' ? ACCOUNTS.find((x) => x.id === acc) : acc;
  if (!a) return;
  ui.account = a.id;
  ui.role = a.role;
  ui.mode = a.mode;
  if (a.merchantId) ui.merchantId = a.merchantId;
  if (a.enterpriseId) ui.enterpriseId = a.enterpriseId;
}

export function who() {
  return ACCOUNTS.find((a) => a.id === ui.account) || ACCOUNTS[0];
}
