import { actions as coreActions, login } from './core.js';
import { bizActions, confirmOk } from './biz.js';

const ALL = { ...coreActions, ...bizActions, 'confirm-ok': confirmOk };

export function dispatch(name, el) {
  const fn = ALL[name];
  if (!fn) return false;
  fn(el);
  return true;
}

export { login };
