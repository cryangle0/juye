import { ui } from './state.js';
import { defaultRoute } from '../shell/menus.js';

export function canAccess(mode, route) {
  if (!route) return false;
  if (mode === 'mini') return route.startsWith('mini-');
  if (mode === 'merchant') return route.startsWith('p-');
  if (mode === 'enterprise') return route.startsWith('e-');
  if (mode === 'store') return route.startsWith('s-') || route === 'verify-records';
  return !route.startsWith('mini-') && !route.startsWith('p-') && !route.startsWith('e-') && !route.startsWith('s-');
}

export function ensureRoute() {
  if (!canAccess(ui.mode, ui.route)) ui.route = defaultRoute(ui.mode);
  const hash = '#' + ui.route;
  if (location.hash !== hash) history.replaceState(null, '', hash);
}
