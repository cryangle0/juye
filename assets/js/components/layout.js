import { escapeHtml } from '../lib/html.js';

export function PageHeader({ title, desc = '', actions = '' }) {
  return `<div class="page-header">
    <div><h2>${escapeHtml(title)}</h2>${desc ? `<p>${desc}</p>` : ''}</div>
    <div class="page-actions">${actions}</div>
  </div>`;
}

export function Card({ title, body, extraClass = '' }) {
  return `<div class="page-card ${extraClass}">${title ? `<h3 class="section-title">${escapeHtml(title)}</h3>` : ''}${body}</div>`;
}

export function Alert({ text, kind = 'info' }) {
  return `<div class="alert alert-${kind}">${text}</div>`;
}

export function Metric({ label, value, go, tone = '' }) {
  const attr = go ? ` data-go="${go}" style="cursor:pointer"` : '';
  return `<div class="metric-card${tone ? ' metric-card--' + tone : ''}"${attr}>
    <div class="metric-label">${escapeHtml(label)}</div>
    <div class="metric-value num">${value}</div>
  </div>`;
}

export function MetricGrid(items) {
  return `<div class="metric-grid">${items.join('')}</div>`;
}

export function Tabs({ key, items, current }) {
  const cur = current || items[0]?.id;
  return `<div class="page-card"><div class="tabs">${items.map((it) => {
    const badge = it.badge != null ? `<span class="menu-badge">${it.badge}</span>` : '';
    return `<button type="button" class="tab ${cur === it.id ? 'active' : ''}" data-tab="${key}:${it.id}">${escapeHtml(it.title)}${badge}</button>`;
  }).join('')}</div></div>`;
}

export function Kv(pairs) {
  return `<dl class="kv-grid">${pairs.map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
}

export function Field({ label, inner, span2 = false }) {
  return `<div class="form-field${span2 ? ' span-2' : ''}"><label>${escapeHtml(label)}</label>${inner}</div>`;
}

export function Input({ id, value = '', placeholder = '', type = 'text' }) {
  return `<input class="field-input" id="${id}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />`;
}
