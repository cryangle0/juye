import { escapeHtml } from '../lib/html.js';

export function Modal({ title, body, foot }) {
  return `<div class="modal-mask">
    <div class="modal" id="modal-box">
      <div class="modal-hd"><span>${escapeHtml(title)}</span>
        <button class="btn btn-sm" data-action="close-modal">关闭</button>
      </div>
      <div class="modal-bd">${body}</div>
      <div class="modal-ft modal-ft--end">${foot || ''}</div>
    </div>
  </div>`;
}

export function Confirm(c) {
  if (!c) return '';
  return `<div class="confirm-mask">
    <div class="confirm-box" role="dialog" aria-modal="true">
      <div class="confirm-hd"><strong>${escapeHtml(c.title)}</strong></div>
      <div class="confirm-bd">
        <p style="white-space:pre-wrap;margin:0;line-height:1.55">${escapeHtml(c.message)}</p>
        ${c.input ? `<div class="form-field" style="margin-top:12px"><label>${escapeHtml(c.input.label || '说明')}</label>
          <textarea class="field-input" id="confirm-input" rows="3" placeholder="${escapeHtml(c.input.placeholder || '')}">${escapeHtml(c.input.value || '')}</textarea>
        </div>` : ''}
      </div>
      <div class="confirm-ft">
        ${c.hideCancel ? '' : `<button class="btn" data-action="confirm-cancel">${escapeHtml(c.cancelText || '取消')}</button>`}
        <button class="btn ${c.danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm-ok">${escapeHtml(c.okText || '确定')}</button>
      </div>
    </div>
  </div>`;
}

export function Toast(t) {
  if (!t) return '';
  return `<div class="toast-wrap"><div class="toast ${t.kind || 'ok'}">${escapeHtml(t.msg)}</div></div>`;
}

export function Loading({ text = '处理中…' } = {}) {
  return `<div class="confirm-mask"><div class="confirm-box confirm-box--ack">
    <div class="confirm-bd"><p style="margin:0;text-align:center">${escapeHtml(text)}</p></div>
  </div></div>`;
}
