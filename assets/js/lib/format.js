export function money(n) {
  return '¥' + Number(n || 0).toLocaleString('zh-CN');
}

export function qty(n) {
  return Number(n || 0).toLocaleString('zh-CN');
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
