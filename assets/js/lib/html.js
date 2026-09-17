/** HTML 转义：所有组件统一走这里，避免拼接 XSS。 */
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => MAP[ch]);
}

export function attr(value) {
  return escapeHtml(value);
}
