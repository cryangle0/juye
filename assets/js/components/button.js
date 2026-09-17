import { escapeHtml } from '../lib/html.js';

export function Btn({
  label, action, go, extra = '', primary = false, danger = false, ghost = false, block = false, size = 'sm',
}) {
  const cls = [
    'btn',
    size === 'sm' ? 'btn-sm' : '',
    primary ? 'btn-primary' : '',
    danger ? 'btn-danger' : '',
    ghost ? 'btn-ghost' : '',
    block ? 'btn-block' : '',
  ].filter(Boolean).join(' ');
  const act = action ? ` data-action="${action}"` : '';
  const to = go ? ` data-go="${go}"` : '';
  return `<button type="button" class="${cls}"${act}${to} ${extra}>${escapeHtml(label)}</button>`;
}

export function Ops(buttons) {
  return `<div class="ops">${buttons.filter(Boolean).join('')}</div>`;
}
