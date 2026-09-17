import { LEVELS } from '../../data/constants.js';
import { pageCtx } from '../context.js';
import { member } from '../../lib/store.js';
import { levelName } from '../../lib/names.js';
import { ui } from '../../app/state.js';
import { money } from '../../lib/format.js';

export function pageMiniMine() {
  const { db, C } = pageCtx();
  const m = member(ui.memberId);
  if (!m) {
    return C.MiniHero({ title: '游客', desc: '登录后同步小程序 / H5 同一账号' })
      + C.Btn({ label: '切换为会员演示', action: 'mini-member', extra: 'data-id="m2"', primary: true, block: true, size: '' })
      + C.Btn({ label: '账号注销说明', action: 'toast', extra: 'data-msg="注销将删除/匿名化会员数据（演示）"', block: true, size: '' });
  }
  const lv = LEVELS.find((l) => l.id === m.level);
  return C.MiniHero({ title: m.name, desc: `${levelName(m.level)} · ${m.phone}` })
    + `<div class="glass-card" style="margin:10px 0">
        <div class="glass-kicker">成长值 ${m.growth} / 下一档 ${LEVELS[Math.min(LEVELS.length - 1, LEVELS.indexOf(lv) + 1)].threshold}</div>
        <div class="glass-duo"><div><span>C 积分</span><strong>${m.cPoints}</strong></div><div><span>累计消费</span><strong>${money(m.spend)}</strong></div></div>
      </div>`
    + C.MiniList([
      C.MiniItem({ title: '我的订单', meta: '购物 / 核销 / 定制', go: 'mini-orders' }),
      C.MiniItem({ title: '卡包', meta: '券 / 研学卡 / 核销码', go: 'mini-wallet' }),
      C.MiniItem({ title: '积分', meta: '明细 / 兑换 / 抵现', go: 'mini-points' }),
      C.MiniItem({ title: '积分兑换', meta: 'DIY券 / 小样 6 款', go: 'mini-redeem' }),
      C.MiniItem({ title: '预约与活动', meta: '场地 / 报名 / 改签', go: 'mini-book' }),
      C.MiniItem({ title: '仪式与定制', meta: '定金电话约档', go: 'mini-ceremony' }),
      C.MiniItem({ title: '数字藏品', meta: '金卡/黑钻权限门', go: 'mini-nft' }),
      C.MiniItem({ title: '邀请有礼', meta: '仅一层 · 首单发分', go: 'mini-invite' }),
      C.MiniItem({ title: '消息', meta: '开场提醒 / 候补转正', go: 'mini-msg' }),
      C.MiniItem({ title: '隐私与注销', meta: '授权弹窗 · 注销', go: 'mini-privacy' }),
    ]);
}

export function pageMiniWallet() {
  const { db, C } = pageCtx();
  const m = member(ui.memberId);
  const coupons = db.coupons.filter((c) => c.user === m?.id);
  const cards = db.orders.filter((o) => o.userId === m?.id && o.verifyCode);
  const vouchers = (db.redeemVouchers || []).filter((v) => v.userId === m?.id);
  return `<div class="mini-page-title">卡包</div>`
    + C.Card({ title: '优惠券', body: coupons.map((c) => `<div>${c.name} ${C.Tag(c.status)}</div>`).join('') || '暂无券' })
    + C.Card({ title: '核销凭证', body: cards.map((o) => `<div class="num">${o.verifyCode} · ${o.status}${o.timesLeft ? ` · 余${o.timesLeft}/${o.times || o.timesLeft}次` : ''}</div>`).join('') || '暂无' })
    + C.Card({ title: '积分兑换凭证', body: vouchers.map((v) => `<div class="num">${v.code} ${v.name} ${C.Tag(v.status)}</div>`).join('') || '暂无' });
}

export function pageMiniPoints() {
  const { db, C } = pageCtx();
  const rows = db.pointsC.filter((x) => x.userId === ui.memberId);
  return `<div class="mini-page-title">积分明细</div>`
    + C.Btn({ label: '去兑换', go: 'mini-redeem', primary: true, block: true, size: '' })
    + C.Btn({ label: '领取生日礼', action: 'grant-birthday', extra: `data-id="${ui.memberId}"`, block: true, size: '' })
    + C.MiniList(rows.map((x) => C.MiniItem({ title: `${x.type} ${x.delta}`, meta: `${x.note} · ${x.at}`, go: 'mini-points' })))
    + (rows.length ? '' : C.Empty({ text: '暂无流水' }));
}

export function pageMiniRedeem() {
  const { db, C } = pageCtx();
  const m = member(ui.memberId);
  const items = db.redeemItems || [];
  const vouchers = (db.redeemVouchers || []).filter((v) => v.userId === ui.memberId);
  return `<div class="mini-page-title">积分兑换</div>
    <p class="mini-page-desc">当前 C 积分 ${m?.cPoints || 0}。兑换生成到店核销凭证。</p>`
    + items.map((r) => `<div class="mini-sn-card" style="margin-bottom:8px">
        <strong>${C.escapeHtml(r.name)}</strong>
        <div class="muted">${r.cost} 积分 · ${r.kind}</div>
        ${C.Btn({ label: '兑换', action: 'redeem-item', extra: `data-id="${r.id}"`, primary: true, size: 'sm' })}
      </div>`).join('')
    + `<h4>我的凭证</h4>`
    + (vouchers.map((v) => `<div class="mini-sn-card">${v.code} ${v.name} ${C.Tag(v.status)}</div>`).join('') || '暂无');
}

export function pageMiniPrivacy() {
  const { C } = pageCtx();
  return `<div class="mini-page-title">隐私与注销</div>
    <p class="mini-page-desc">小程序 + H5/公众号同一会员账号。隐私政策授权弹窗、账号注销（删除/匿名化）。不做独立 APP。</p>
    ${C.Alert({ kind: 'info', text: ui.client === 'h5' ? '当前演示通道：H5/公众号（与小程序同号）' : '当前演示通道：微信小程序' })}
    ${C.Btn({ label: '同意隐私政策（演示）', action: 'toast', extra: 'data-msg="已授权"', primary: true, block: true, size: '' })}
    ${C.Btn({ label: '申请注销', action: 'confirm-cancel-account', danger: true, block: true, size: '' })}`;
}

export function pageMiniMsg() {
  const { db, C } = pageCtx();
  const list = db.messages.filter((m) => m.to === ui.memberId);
  return `<div class="mini-page-title">消息</div>`
    + C.MiniList(list.map((m) => C.MiniItem({ title: m.title, meta: m.body, go: 'mini-msg' })))
    + (list.length ? '' : C.Empty({ text: '暂无消息' }));
}

export function pageMiniInvite() {
  const { db, C } = pageCtx();
  const mine = db.invites.filter((i) => i.from === ui.memberId);
  return `<div class="mini-page-title">邀请有礼</div>
    <p class="mini-page-desc">仅一层：你 ← 新用户。合规不做多级分销。</p>
    ${C.Card({ body: `我的邀请码 <strong>${ui.memberId.toUpperCase()}-LY</strong>` })}
    ${C.Btn({ label: '模拟好友用码注册', action: 'invite-demo', primary: true, block: true, size: '' })}
    ${C.Btn({ label: '模拟被邀请人首单', action: 'invite-first', block: true, size: '' })}
    ${C.Card({ title: '邀请记录', body: mine.map((i) => `<div>${i.to} ${i.status}</div>`).join('') || '暂无' })}`;
}

export function pageMiniReview() {
  const { C } = pageCtx();
  return `<div class="mini-page-title">写评价</div>
    ${C.Field({ label: '评价内容', inner: '<textarea class="field-input" id="f-review" rows="3">装裱很好</textarea>', span2: true })}
    ${C.Btn({ label: '提交（先审后发）', action: 'submit-review', primary: true, block: true, size: '' })}`;
}

export function pageMiniUgc() {
  const { C } = pageCtx();
  return `<div class="mini-page-title">打卡积分</div>
    ${C.Field({ label: '这一刻', inner: '<textarea class="field-input" id="f-ugc" rows="3">工坊打卡</textarea>', span2: true })}
    ${C.Btn({ label: '提交审核', action: 'submit-ugc', primary: true, block: true, size: '' })}`;
}
