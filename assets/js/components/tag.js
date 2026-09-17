import { escapeHtml } from '../lib/html.js';

const TONE = {
  上架: 'green', 通过: 'green', 已完成: 'green', 已核销: 'green', 已过审: 'green',
  已支付待发货: 'green', 成功: 'green', 平: 'green', 已打款: 'green', 已转订单: 'green',
  已认领: 'green', 已占用: 'green', 已占档: 'green', 尾款已付: 'green', 已交付: 'green',
  已出账: 'green', 已签到: 'green', 可用: 'green',
  待审: 'orange', 待发货: 'orange', 待核销: 'orange', 待支付: 'orange', 待财务审: 'orange',
  待对公认领: 'orange', 候补: 'orange', 售后中: 'orange', 待运营放行: 'orange', 已收定金: 'orange',
  制作中: 'orange', 待制作: 'orange', 设计确认: 'orange', 待审批: 'orange', 差异: 'orange',
  待开: 'orange', 待履约: 'orange', 占用: 'orange',
  驳回: 'red', 已驳回: 'red', 冲突驳回: 'red', 已取消: 'red', 已退款: 'red', 已满: 'red',
  草稿: 'gray', 游客: 'gray', 空闲: 'gray', 可约: 'green', 下架: 'gray',
};

export function Tag(text, tone) {
  const t = tone || TONE[text] || 'gray';
  return `<span class="tag tag-${t}">${escapeHtml(text)}</span>`;
}

export function Phase(n) {
  return `<span class="phase-tag${n === 2 ? ' p2' : ''}">${n === 2 ? '二期' : '一期'}</span>`;
}
