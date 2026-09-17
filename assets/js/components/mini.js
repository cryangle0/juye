import { escapeHtml } from '../lib/html.js';
import { money } from '../lib/format.js';

export function MiniHero({ title, desc, extra = '' }) {
  return `<div class="mini-hero"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(desc)}</p>${extra}</div>`;
}

export function MiniGood({ p, price, locked, go = 'mini-detail' }) {
  return `<button type="button" class="mini-good${locked ? ' locked-mask' : ''}" data-go="${go}" data-id="${p.id}">
    <div class="cover">${p.cover}</div>
    <div>
      <strong>${escapeHtml(p.name)}</strong>
      <div class="muted">${escapeHtml(p.spec || '')}</div>
      ${locked ? '<div class="lock-hint">当前等级不可购买</div>' : ''}
    </div>
    <div class="num">${money(price)}</div>
  </button>`;
}

export function MiniList(items) {
  return `<div class="mini-list">${items.join('')}</div>`;
}

export function MiniItem({ title, meta, go, extra = '', id = '' }) {
  return `<button type="button" class="mini-list-item" data-go="${go}" data-id="${id}" ${extra}>
    <div>
      <div style="font-weight:700">${escapeHtml(title)}</div>
      <div class="muted">${meta}</div>
    </div>
  </button>`;
}

export function Seg({ key, items, current }) {
  return `<div class="mini-seg">${items.map((it) => `<button type="button" class="mini-seg-btn ${current === it.id ? 'on' : ''}" data-tab="${key}:${it.id}">${escapeHtml(it.title)}</button>`).join('')}</div>`;
}

export function PaySheet({ rows, pay }) {
  return `<div class="pay-sheet">${rows.map((r) => `<div class="pay-row${r.strong ? ' strong' : ''}"><span>${escapeHtml(r.k)}</span><span>${r.v}</span></div>`).join('')}
    <div class="pay-row strong"><span>应付</span><span class="num">${money(pay)}</span></div>
  </div>`;
}

export function Timeline(items) {
  return `<div class="timeline">${items.map((it) => `<div class="tl-item"><div class="tl-dot"></div><div><div class="mini-tl-title">${escapeHtml(it.title)}</div><div class="muted">${escapeHtml(it.desc || '')}</div></div></div>`).join('')}</div>`;
}

export const MINI_ICONS = {
  home: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5"/><path d="M7 10.5V19h10v-8.5"/><path d="M10 19v-5h4v5"/></svg>',
  shop: '<svg viewBox="0 0 24 24"><path d="M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7z"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  ticket: '<svg viewBox="0 0 24 24"><path d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V8z"/></svg>',
  mine: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/></svg>',
  scan: '<svg viewBox="0 0 24 24"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
};
