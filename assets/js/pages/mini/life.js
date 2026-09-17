import { pageCtx } from '../context.js';
import { member } from '../../lib/store.js';
import { ui } from '../../app/state.js';
import { money } from '../../lib/format.js';

export function pageMiniBook() {
  const { db, C } = pageCtx();
  return `<div class="mini-page-title">场地预约</div>
    <p class="mini-page-desc">冲突时段不可占用，取消后名额释放。人数 <input class="field-input" id="f-people" value="2" style="width:64px;display:inline-block" /></p>
    ${db.slots.map((s) => {
      const v = db.venues.find((x) => x.id === s.venueId);
      const full = s.used >= s.cap;
      return `<div class="mini-sn-card" style="margin-bottom:8px">
        <strong>${v.name}</strong>
        <div class="muted">${s.date} ${s.time} · ${s.used}/${s.cap}</div>
        ${C.Btn({ label: full ? '已满（点我看冲突）' : '预约', action: 'book-slot', extra: `data-id="${s.id}"`, primary: !full, size: 'sm' })}
      </div>`;
    }).join('')}
    <h4>我的预约</h4>
    ${db.bookings.filter((b) => b.userId === ui.memberId).map((b) =>
      `<div class="mini-sn-card">${b.verifyCode} ${C.Tag(b.status)} ${b.status === '成功' ? C.Btn({ label: '取消', action: 'cancel-book', extra: `data-id="${b.id}"`, size: 'sm' }) : ''}</div>`
    ).join('') || '暂无'}
    ${C.Btn({ label: '去报名活动', go: 'mini-event', block: true, size: '' })}`;
}

export function pageMiniEvent() {
  const { db, C } = pageCtx();
  return `<div class="mini-page-title">活动报名</div>`
    + db.events.map((e) => `<div class="mini-sn-card" style="margin-bottom:8px">
        <strong>${C.escapeHtml(e.name)}</strong>
        <div class="muted">${e.date} · ${e.used}/${e.cap} · 候补 ${e.wait}</div>
        ${C.Btn({ label: '报名', action: 'signup', extra: `data-id="${e.id}"`, primary: true, size: 'sm' })}
      </div>`).join('')
    + `<h4>我的报名</h4>`
    + db.signups.filter((s) => s.userId === ui.memberId).map((s) => {
      const e = db.events.find((x) => x.id === s.eventId);
      return `<div class="mini-sn-card">${e?.name} ${C.Tag(s.status)} ${s.code || ''}
        ${['成功', '候补'].includes(s.status) ? C.Btn({ label: '取消', action: 'cancel-sign', extra: `data-id="${s.id}"`, size: 'sm' }) : ''}
        ${['成功', '候补'].includes(s.status) ? C.Btn({ label: '改签见面会', action: 'change-sign', extra: `data-id="${s.id}" data-event="EV2"`, size: 'sm' }) : ''}
      </div>`;
    }).join('');
}

export function pageMiniCeremony() {
  const { db, C } = pageCtx();
  const p = db.products.find((x) => x.type === 'ceremony');
  const custom = db.products.find((x) => x.type === 'custom');
  return `<div class="mini-page-title">仪式与定制</div>
    <div class="mini-sn-card">
      <strong>${p.cover} ${p.name}</strong>
      <p class="muted">${p.story}</p>
      ${C.Btn({ label: '电话约档 ' + p.phone, action: 'toast', extra: `data-msg="线上不定档，请拨 ${p.phone}"`, size: 'sm' })}
      ${C.Btn({ label: '支付定金 ' + money(p.deposit), action: 'deposit-cm', extra: `data-id="${p.id}"`, primary: true, size: 'sm' })}
    </div>
    <div class="mini-sn-card" style="margin-top:8px">
      <strong>${custom.cover} ${custom.name}</strong>
      ${C.Field({ label: '款式', inner: C.Input({ id: 'f-style', value: '卷轴' }) })}
      ${C.Field({ label: '文案', inner: C.Input({ id: 'f-text', value: '百年好合' }) })}
      ${C.Field({ label: '材质', inner: C.Input({ id: 'f-mat', value: '金笺' }) })}
      ${C.Btn({ label: '生成定制单', action: 'submit-custom', extra: `data-id="${custom.id}"`, primary: true, size: 'sm' })}
    </div>
    ${C.Btn({ label: '去打卡赚积分', go: 'mini-ugc', block: true, size: '' })}`;
}

export function pageMiniLimited() {
  const { db, C } = pageCtx();
  const list = db.products.filter((p) => p.limited);
  return `<div class="mini-page-title">限量 / 预售</div>`
    + list.map((p) => `<button class="mini-good" data-go="mini-detail" data-id="${p.id}">
        <div class="cover">${p.cover}</div>
        <div><strong>${C.escapeHtml(p.name)}</strong><div class="muted">开售 ${p.saleAt}</div></div>
      </button>`).join('');
}

export function pageMiniVerify() {
  const { db, C } = pageCtx();
  return `<div class="mini-page-title">扫码核销</div>
    <button class="mini-scan-btn" data-action="do-verify"><span class="mini-scan-ico">⌁</span>扫描核销码</button>
    ${C.Field({ label: '或手动输入', inner: C.Input({ id: 'v-code', placeholder: 'HX-8821' }) })}
    ${C.Btn({ label: '确认核销', action: 'do-verify', primary: true, block: true, size: '' })}
    <p class="muted">重复扫描将被拒绝。弱网可重试。</p>
    ${db.verifies.slice(0, 5).map((v) => `<div class="muted">${v.at} ${v.code} ${v.status}</div>`).join('')}`;
}
