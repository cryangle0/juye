import { escapeHtml } from '../lib/html.js';

export function Empty({ text = '暂无数据', actionLabel, action, go }) {
  const cta = action || go
    ? `<div style="margin-top:10px"><button class="btn btn-sm btn-primary" ${action ? `data-action="${action}"` : ''} ${go ? `data-go="${go}"` : ''}>${escapeHtml(actionLabel || '去处理')}</button></div>`
    : '';
  return `<div class="empty-hint">${escapeHtml(text)}${cta}</div>`;
}
