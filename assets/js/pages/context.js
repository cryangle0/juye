import { ui } from '../app/state.js';
import { getDb } from '../lib/store.js';
import * as C from '../components/index.js';
import * as names from '../lib/names.js';

export function pageCtx() {
  return { ui, db: getDb(), C, names };
}
