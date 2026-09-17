import { escapeHtml } from '../lib/html.js';
import { Empty } from './empty.js';

export function Table({ columns, rows, empty = '暂无数据' }) {
  if (!rows.length) return Empty({ text: empty });
  return `<div class="table-wrap"><table class="data">
    <thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${rows.join('')}</tbody>
  </table></div>`;
}

export function tr(cells) {
  return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
}

export function SearchBar({ value = '', placeholder = '搜索', extra = '' }) {
  return `<div class="page-card search-panel">
    <input class="field-input" id="f-q" type="search" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" />
    ${extra}
    <button class="btn btn-sm" data-action="apply-filter">查询</button>
  </div>`;
}
