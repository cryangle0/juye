import { ui } from './state.js';
import { defaultRoute } from '../shell/menus.js';
import { ROLE_ALLOW } from '../data/constants.js';

export function canAccess(mode, route) {
  if (!route) return false;
  if (mode === 'mini') return route.startsWith('mini-');
  if (mode === 'merchant') return route.startsWith('p-');
  if (mode === 'enterprise') return route.startsWith('e-');
  if (mode === 'store') return route.startsWith('s-') || route === 'verify-records';
  if (route.startsWith('mini-') || route.startsWith('p-') || route.startsWith('e-') || route.startsWith('s-')) return false;
  const allow = ROLE_ALLOW[ui.role];
  if (allow) return allow.includes(route);
  return true;
}

export function ensureRoute() {
  if (!canAccess(ui.mode, ui.route)) ui.route = defaultRoute(ui.mode, ui.role);
  const hash = '#' + ui.route;
  if (location.hash !== hash) history.replaceState(null, '', hash);
}
