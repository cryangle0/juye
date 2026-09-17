import { D, val, flash, toast, ask, navigate, withLoading, ui, getDb, save, audit, LEVELS, render, handleResult, actions as coreActions } from './core.js';

const who = () => ui.account;

export const bizActions = {
  'merchant-pass'(el) { handleResult(D.auditMerchant(el.dataset.id, true, '', who())); },
  'merchant-reject'(el) {
    ask({ title: '驳回入驻', message: '将回传原因给商家。', input: { label: '原因', value: '权属证明不完整' }, action: 'merchant-reject-ok', payload: { id: el.dataset.id } });
    render();
  },
  'merchant-reject-ok'() {
    const id = ui.confirm.payload.id;
    const reason = val('confirm-input');
    ui.confirm = null;
    handleResult(D.auditMerchant(id, false, reason, who()));
  },
  'product-pass'(el) { handleResult(D.auditProduct(el.dataset.id, true, '', who())); },
  'product-reject'(el) {
    ask({ title: '驳回商品', message: '原因将回传商家。', input: { label: '原因', value: '图片清晰度不足' }, action: 'product-reject-ok', payload: { id: el.dataset.id } });
    render();
  },
  'product-reject-ok'() {
    const id = ui.confirm.payload.id;
    const reason = val('confirm-input');
    ui.confirm = null;
    handleResult(D.auditProduct(id, false, reason, who()));
  },
  'product-off'(el) { handleResult(D.auditProduct(el.dataset.id, false, '运营下架', who())); },
  'save-price'(el) {
    const p = getDb().products.find((x) => x.id === el.dataset.id);
    p.guide = Number(val('f-guide') || p.guide);
    audit(who(), '改价', `${p.name} 指导价 ${p.guide}`);
    save();
    ui.modal = null;
    toast('已改价并写入审计');
    render();
  },
  'save-stock'(el) { handleResult(D.adjustStock(el.dataset.id, val('f-delta'))); ui.modal = null; render(); },
  'save-levels'() {
    LEVELS.forEach((l) => {
      l.threshold = Number(val('th-' + l.id) || l.threshold);
      l.keep = Number(val('kp-' + l.id) || l.keep);
    });
    toast('阈值已保存（演示）');
  },
  'point-transfer'() { handleResult(D.transferPoints('m4', 'M1', 100)); },
  ship(el) { handleResult(D.ship(el.dataset.id)); },
  complete(el) { handleResult(D.complete(el.dataset.id)); },
  'as-pass'(el) { handleResult(D.decideAftersale(el.dataset.id, true, who())); },
  'as-reject'(el) { handleResult(D.decideAftersale(el.dataset.id, false, who())); },
  'apply-as'(el) { handleResult(D.applyAftersale(el.dataset.id, '仅退款', '不想要了')); },
  'invoice-fill'(el) { handleResult(D.fillInvoice(el.dataset.id)); },
  'do-verify'() {
    const code = val('v-code') || 'HX-8821';
    handleResult(D.verifyCode(code, ui.account || 'store'));
  },
  'grant-full'() { handleResult(D.grantCoupon('m2', 'TPL2')); },
  'grant-new'() { handleResult(D.grantCoupon('m1', 'TPL1')); },
  'toggle-memberday'() { handleResult(D.toggleMemberDay()); },
  'wd-pass'(el) { handleResult(D.approveWithdraw(el.dataset.id, true, who())); },
  'wd-reject'(el) { handleResult(D.approveWithdraw(el.dataset.id, false, who())); },
  'bill-appeal'(el) { handleResult(D.billAppeal(el.dataset.id, '请核对 8 月退款分摊')); },
  'trace-lookup'(el) { handleResult(D.lookupTrace(el.dataset.code)); },
  'trace-q'() {
    const code = val('f-code') || 'LY-2026-0007';
    const res = D.lookupTrace(code);
    flash(res);
    render();
  },
  'book-slot'(el) { handleResult(D.bookSlot(ui.memberId || 'm2', el.dataset.id, Number(val('f-people') || 2))); },
  'cancel-book'(el) { handleResult(D.cancelBook(el.dataset.id)); },
  'change-book'(el) {
    const other = getDb().slots.find((s) => s.id !== getDb().bookings.find((b) => b.id === el.dataset.id)?.slotId);
    handleResult(D.changeBook(el.dataset.id, other?.id || 'S3'));
  },
  signup(el) { handleResult(D.signupEvent(ui.memberId || 'm2', el.dataset.id)); },
  'cancel-sign'(el) { handleResult(D.cancelSignup(el.dataset.id)); },
  'export-sign'() { toast('已导出签到名单 CSV（演示）'); },
  remind() { toast('已补发开场前提醒（微信模板+站内信）'); },
  'pay-balance'(el) { handleResult(D.payBalance(el.dataset.id)); },
  'deliver-cm'(el) { handleResult(D.deliverCeremony(el.dataset.id)); },
  'refund-deposit'(el) { handleResult(D.refundDeposit(el.dataset.id)); },
  'deposit-cm'(el) { handleResult(D.depositCeremony(ui.memberId, el.dataset.id)); },
  'custom-next'(el) { handleResult(D.advanceCustom(el.dataset.id)); },
  'submit-custom'(el) { handleResult(D.submitCustom(ui.memberId, el.dataset.id, val('f-style') || '卷轴', val('f-text') || '百年好合', val('f-mat') || '金笺')); },
  'iq-pass'(el) { handleResult(D.approveInquiry(el.dataset.id, true, who())); },
  'iq-reject'(el) { handleResult(D.approveInquiry(el.dataset.id, false, who())); },
  claim(el) { handleResult(D.claimPay(el.dataset.id, who())); },
  'logo-next'(el) { handleResult(D.advanceLogo(el.dataset.id)); },
  'e-bulk-new'() { handleResult(D.addBulk(ui.enterpriseId || 'E1')); },
  'e-logo-new'() { handleResult(D.addLogo(ui.enterpriseId || 'E1')); },
  'e-iq-new'() { handleResult(D.addInquiry(ui.enterpriseId || 'E1', '端午礼盒 800 套')); },
  'sale-now'(el) { handleResult(D.setSaleAt(el.dataset.id, '2026-09-17 10:00')); },
  'sale-later'(el) { handleResult(D.setSaleAt(el.dataset.id, '2026-10-01 10:00')); },
  'res-pass'(el) { handleResult(D.approveResource(el.dataset.id, true)); },
  'res-reject'(el) { handleResult(D.approveResource(el.dataset.id, false)); },
  'p-res'(el) { handleResult(D.applyResource(ui.merchantId, el.dataset.id)); },
  'p-ex'(el) { handleResult(D.exchangeResource(ui.merchantId, el.dataset.id, 2000)); },
  'ln-pass'(el) { handleResult(D.decideLaunch(el.dataset.id, true)); },
  'ln-reject'(el) { handleResult(D.decideLaunch(el.dataset.id, false)); },
  'p-launch'() { handleResult(D.submitLaunch(ui.merchantId, '联名新作提报')); },
  'p-new-product'() { handleResult(D.submitProduct(ui.merchantId, '新作小品')); },
  'p-reply'(el) {
    ask({ title: '回复评价', message: '回复将展示在商品详情。', input: { label: '回复', value: '感谢支持' }, action: 'p-reply-ok', payload: { id: el.dataset.id } });
    render();
  },
  'p-reply-ok'() {
    const id = ui.confirm.payload.id;
    const text = val('confirm-input');
    ui.confirm = null;
    handleResult(D.replyReview(id, text));
  },
  'save-trace'() {
    getDb().codes.forEach((c) => {
      const el = document.getElementById('tr-' + c.id);
      if (el) c.trace = el.value;
    });
    save();
    toast('存证编号已保存');
    render();
  },
  'rv-pass'(el) { handleResult(D.reviewPass(el.dataset.id, true)); },
  'rv-reject'(el) { handleResult(D.reviewPass(el.dataset.id, false)); },
  'ugc-pass'(el) { handleResult(D.ugcPass(el.dataset.id, true)); },
  'ugc-reject'(el) { handleResult(D.ugcPass(el.dataset.id, false)); },
  'seg-coupon'() { handleResult(D.grantCoupon('m2', 'TPL2')); },
  'add-cart'(el) { handleResult(D.addCart(ui.memberId, el.dataset.id, 1)); },
  'cart-plus'(el) { handleResult(D.changeCart(ui.memberId, el.dataset.id, 1)); },
  'cart-minus'(el) { handleResult(D.changeCart(ui.memberId, el.dataset.id, -1)); },
  'cart-remove'(el) { handleResult(D.removeCart(ui.memberId, el.dataset.id)); },
  checkout() {
    ui.couponId = val('f-coupon');
    ui.usePoints = document.getElementById('f-points') ? document.getElementById('f-points').checked : true;
    ui.fulfill = val('f-fulfill') || ui.fulfill || '快递';
    ui.payKind = val('f-paykind') || 'full';
    const res = D.checkout(ui.memberId, ui.couponId, ui.usePoints, ui.fulfill, ui.payKind);
    if (flash(res)) {
      ui.orderId = res.orders[0].id;
      navigate('mini-pay');
    } else render();
  },
  'pay-order'(el) {
    const id = el.dataset.id || ui.orderId;
    const channel = el.dataset.channel || '微信';
    withLoading('正在调起' + channel + '支付…', () => new Promise((r) => setTimeout(r, 420))).then(() => {
      const res = D.payOrder(id, channel);
      if (flash(res)) navigate('mini-orders');
      else render();
    });
  },
  'cancel-order'(el) { handleResult(D.cancelUnpaid(el.dataset.id || ui.orderId), 'mini-cart'); },
  'release-timeout'() { handleResult(D.releaseTimeout()); },
  'apply-invoice'(el) {
    handleResult(D.applyInvoice(el.dataset.id || ui.orderId, val('f-inv-kind') || '个人', val('f-inv-title'), val('f-inv-tax')));
  },
  'redeem-item'(el) { handleResult(D.redeemPoints(ui.memberId, el.dataset.id)); },
  'grant-birthday'(el) { handleResult(D.grantBirthday(el.dataset.id || ui.memberId)); },
  'expire-points'() { handleResult(D.expirePoints(ui.memberId || 'm2', 10)); },
  'import-addr'(el) { handleResult(D.importAddresses(el.dataset.id, val('f-addr'))); },
  'e-vat'() { handleResult(D.applyVat(ui.enterpriseId || 'E1', val('f-oid'))); },
  'hang-vip'() { handleResult(D.hangVipPrice(ui.enterpriseId || 'E1', val('f-pid') || 'P11', val('f-vip') || 238)); },
  'change-sign'(el) { handleResult(D.changeSignup(el.dataset.id, el.dataset.event)); },
  'p-signup'(el) { handleResult(D.signupEvent(ui.merchantId, el.dataset.id)); },
  'invite-demo'() { handleResult(D.inviteAccept(ui.memberId, 'guest-new')); },
  'invite-first'() { handleResult(D.simulateInviteFirstOrder(ui.memberId)); },
  'submit-review'() { handleResult(D.submitReview(ui.memberId, ui.productId, val('f-review') || '很好')); },
  'submit-ugc'() { handleResult(D.submitUgc(ui.memberId, val('f-ugc') || '打卡')); },
};

export function confirmOk() {
  const c = ui.confirm;
  if (!c?.action) {
    ui.confirm = null;
    render();
    return;
  }
  const fn = bizActions[c.action] || coreActions[c.action];
  if (fn) fn();
  else {
    ui.confirm = null;
    render();
  }
}
